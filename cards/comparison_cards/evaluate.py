# Incoming globals: definition, response, last_transition, previous_state
import logging
import arrow

logger = logging.getLogger('db')
result['actions'] = []


# a function to get the context of the variable
def get_context(define, extras):
    game = extras['session'].game_version.game
    player = extras['session'].player
    session = extras['session']
    if 'scope_name' not in define:
        scope = 'player'
    else:
        scope = define['scope_name']

    if scope == "player":
        context = player
    elif scope == 'game':
        context = game
    else:
        context = session
    return context


#tries to get variable in order session, player game and returns none if no variable
def get_variable_in_order(variable_name,extras):
    game = extras['session'].game_version.game
    player = extras['session'].player
    session = extras['session']
    var = session.fetch_variable(variable_name)

    if not var:
        var = player.fetch_variable(variable_name)

    if not var:
        var = game.fetch_variable(variable_name)

    if not var:
        return None
    return var

# return int or float representation of the string
# https://stackoverflow.com/questions/5608702/how-can-i-convert-a-string-to-either-int-or-float-with-priority-on-int
def int_or_float(string):
    try:
        return int(string)
    except ValueError:
        f = float(string)
        i = int(f)
        if f == i:
            return i
        else:
            return f

print("start")

# retrieve the two variables from the defined context
var1 = get_variable_in_order(definition['first_variable'],extras)
var2 = get_variable_in_order(definition['second_variable'],extras)


# calculate the possible error conditions that will push into the error branch

error = ""
type = None
if not var1 or not var2:
    error = "Missing values"
# determine the types
# this is a numeric type
if var1.isnumeric() and var2.isnumeric():
    type = "numeric"
    var1 = int_or_float(var1)
    var2 = int_or_float(var2)
# this is checking for date types and special keyword "now"
else:
    # special keyboard "now" for a dynamic time
    now = arrow.now()
    if var1 == "now":
        var1 = now
    if var2 == "now":
        var2 = now
    try:
        if not isinstance(var1, arrow.arrow.Arrow):
            var1 = arrow.get(var1, "MM/DD/YYYY")
        if not isinstance(var2, arrow.arrow.Arrow):
            var2 = arrow.get(var2, "MM/DD/YYYY")
        type = "date"
    except TypeError:
        error = "Not a supported type"

# comparison operators
result_op = False
if not error:
    if definition['operator'] == "equals":
        if var1 == var2:
            result_op = True
    elif definition['operator'] == "not_equals":
        if var1 != var2:
            result_op = True
    elif definition['operator'] == "less_than":
        if var1 < var2:
            result_op = True
    elif definition['operator'] == "greater_than":
        if var1 > var2:
            result_op = True
else:
    # if and error occurs it sets the variable that can looked up
    variable = {
        'type': 'set-variable',
        'name': definition['name'],
        'variable': 'comparison_error',
        'value': error,
        'scope': "session"
    }

    result['actions'].append(variable)
# the next card is based on true false or error codes are set
if error:
    result['next_id'] = definition['next_error']
elif result_op:
    result['next_id'] = definition['next_true']
else:
    result['next_id'] = definition['next_false']

if ('#' in result['next_id']) is False:
    result['next_id'] = definition['sequence_id'] + '#' + result['next_id']

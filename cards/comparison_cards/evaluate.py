# Incoming globals: definition, response, last_transition, previous_state
import logging
import arrow

logger = logging.getLogger('db')
result['actions'] = []

# a function to get the context of the variable
def get_context(scope_name,define,extras):
    game = extras['session'].game_version.game
    player = extras['session'].player
    session = extras['session']
    if scope_name not in define:
        scope = 'player'
    else:
        scope = define[scope_name]

    if scope == "player":
        context = player
    elif scope == 'game':
        context = game
    else:
        context = session
    return context
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

# retrieve the two variables from the defined context
context1 = get_context('first_scope',definition, extras)
context2 = get_context('second_scope',definition, extras)

var1 = context1.fetch_variable(definition['first_variable'])
var2 = context2.fetch_variable(definition['second_variable'])

#calculate the possible error conditions that will push into the error branch

error = ""
type = None

if not var1 or not var2:
    error = "Missing values"
# determine the types
if var1.isnumeric() and var2.isnumeric():
    type = "numeric"
    var1 = int_or_float(var1)
    var2 = int_or_float(var2)
else:
    if var1 == "now":
        var1 = arrow.now()
    if var2 == "now":
        var2 = arrow.now()
    try:
        if not isinstance(var1, arrow):
            var1 = arrow.get(var1, "MM/DD/YYYY HH:MM:ss")
        if not isinstance(var2, arrow):
            var2 = arrow.get(var2, "MM/DD/YYYY HH:MM:ss")

        if isinstance(var1, arrow) and isinstance(var2, arrow):
            type = "time"
    except TypeError:
        error = "Not a supported type"

result_op = True
if not error:
    if definition['operator'] == "equals":
        if var1 == var2:
            result_op = True
    if definition['operator'] == "not_equals":
        if var1 != var2:
            result_op = True
    if definition['operator'] == "less_than":
        if var1 < var2:
            result_op = True
    if definition['operator'] == "greater_than":
        if var1 > var2:
            result_op = True
else:
    variable = {
        'type': 'set-variable',
        'name': definition['name'],
        'variable': 'logic_error',
        'value': error,
        'scope': "session"
    }

    result['actions'].append(variable)

if error:
    result['next_id'] = definition['next_error']
elif result_op:
    result['next_id'] = definition['next_true']
else:
    result['next_id'] = definition['next_false']

if ('#' in result['next_id']) is False:
    result['next_id'] = definition['sequence_id'] + '#' + result['next_id']

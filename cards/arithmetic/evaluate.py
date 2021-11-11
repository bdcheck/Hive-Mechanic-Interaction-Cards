# Incoming globals: definition, response, last_transition, previous_state
import logging

logger = logging.getLogger('db')
print("here")

#return the context of the variables
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

var1 = get_variable_in_order(definition['first_variable'],extras)
var2 = get_variable_in_order(definition['second_variable'],extras)

# initial error checking
error = ""
if not var1 or not var2:
    error = "Missing values"
elif not var1.isnumeric() or not var2.isnumeric():
    error = "Variables are not numeric"

num1 = int_or_float(var1)
num2 = int_or_float(var2)
result_num = 0
#if initial error checking is done try to run operation
if not error:
    try:
        if definition['operator'] == "addition":
            result_num = num1 + num2
        elif definition['operator'] == "subtraction":
            result_num = num1 - num2
        elif definition['operator'] == "multiplication":
            result_num = num1 * num2
        elif definition['operator'] == "division":
            result_num = num1 / num2
    except Exception as e:
        error = str(e)

result['actions'] = []
#set error variable if there is an error and set next card to the error card
if error:
    result['next_id'] = definition['next_error']
    variable = {
        'type': 'set-variable',
        'name': definition['name'],
        'variable': 'arithmetic_error',
        'value': error,
        'scope': "session"
    }
    result['actions'].append(variable)
#or if it ran correctly set result card
else:
    result['next_id'] = definition['next']
    variable = {
        'type': 'set-variable',
        'name': definition['name'],
        'variable': 'arithmetic_result',
        'value': result_num,
        'scope': "session"
    }

    result['actions'].append(variable)


if ('#' in result['next_id']) is False:
    result['next_id'] = definition['sequence_id'] + '#' + result['next_id']

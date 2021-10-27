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

context1 = get_context('first_scope',definition, extras)
context2 = get_context('second_scope',definition, extras)

var1 = context1.fetch_variable(definition['first_variable'])
var2 = context2.fetch_variable(definition['second_variable'])

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

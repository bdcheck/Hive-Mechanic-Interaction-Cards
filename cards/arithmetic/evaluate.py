# Incoming globals: definition, response, last_transition, previous_state
import logging

logger = logging.getLogger('db')

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
    session = extras['session']

    var = session.fetch_variable(variable_name)

    return var

var1 = get_variable_in_order(definition['first_variable'], extras)
var2 = get_variable_in_order(definition['second_variable'], extras)
save_var = definition["variable_to_save"]

# initial error checking
error = ""
if not var1 or not var2 or not save_var:
    error = "Missing values"

try:
    num1 = float(var1)
    num2 = float(var2)
    are_numbers = True
except ValueError:
    error = "Variables are not numeric"
    are_numbers = False


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
            if isinstance(num1,int) and isinstance(num2, int):
                result_num = num1 // num2
            else:
                result_num = num1 / num2
    except BaseException as e:
        error = str(e)

result['actions'] = []
#set error variable if there is an error and set next card to the error card
if error:
    if 'next_error' in definition:
        result['next_id'] = definition['next_error']
    else:
        result['next_id'] = definition['next']
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
    if result_num - int(result_num) == 0:
        result_num = int(result_num)
    else:
        result_num = round(result_num,3)
    result['next_id'] = definition['next']
    variable = {
        'type': 'set-variable',
        'name': definition['name'],
        'variable': save_var,
        'value': str(result_num),
        'scope': "session"
    }

    result['actions'].append(variable)


if ('#' in result['next_id']) is False:
    result['next_id'] = definition['sequence_id'] + '#' + result['next_id']

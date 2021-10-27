# Incoming globals: definition, response, last_transition, previous_state
import logging

logger = logging.getLogger('db')
result['actions'] = []

# a function to get the context so retrieving the variable works
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

# retrieve the two variables to compare
context1 = get_context('first_scope',definition, extras)
context2 = get_context('second_scope',definition, extras)

var1 = context1.fetch_variable(definition['first_variable'])
var2 = context2.fetch_variable(definition['second_variable'])

#calculate the possible error conditions that will push into the error branch
error = ""
if not var1 or not var2:
    error = "Missing values"
elif not var1.isnumeric() or not var2.isnumeric():
    error = "Variables are not numeric"

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

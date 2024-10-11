import math
import statistics

variable = definition.get('variable', None)
scope = definition.get('scope', None)

operation = definition.get('operation', None)

result_variable = definition.get('summary', None)
result_scope = definition.get('summary_scope', None)

values = extras['session'].fetch_values(variable, scope=scope)

if operation in ['mean', 'sum', 'median', ]:
    new_values = []

    for value in values:
        try:
            float_value = float(value)
        except ValueError:
            pass

        if math.isnan(float_value) is False:
            new_values.append(float_value)

    values = new_values

try:
    values.sort()
except TypeError:
    new_values = []

    for value in values:
        new_values.append(str(value))

    values = new_values

result_value = None

if len(values) > 0:
    if operation == 'mean':
        result_value = statistics.mean(values)

    if operation == 'median':
        result_value = statistics.median(values)

    if operation == 'mode':
        result_value = statistics.mode(values)

    if operation == 'sum':
        result_value = sum(values)

    if operation == 'minimum':
        result_value = values[0]

    if operation == 'maximum':
        result_value = values[-1]

if operation == 'count':
    result_value = len(values)

set_variable_action = {
    'type': 'set-variable',
    'name': definition['name'],
    'variable': result_variable,
    'value': str(result_value),
    'scope': result_scope,
    'metadata': {
        'summarized_variable': variable,
        'summary_scope': scope,
        'operation': operation,
    }
}

result['details'] = {
    'name': definition['name'],
    'value': result_value,
    'metadata': {
        'summarized_variable': variable,
        'summary_scope': scope,
        'operation': operation,
    }
}

result['actions'] = [set_variable_action]

result['next_id'] = definition['next']

if ('#' in result['next_id']) is False:
    result['next_id'] = definition['sequence_id'] + '#' + result['next_id']

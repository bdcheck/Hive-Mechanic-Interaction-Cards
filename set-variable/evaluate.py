# Incoming globals: definition, response, last_transition, previous_state

result['details'] = {
    'name': definition['variable'],
    'value': definition['value'],
}

if 'scope' in definition:
    result['scope'] = definition['scope']

result['actions'] = []

result['next_id'] = definition['next']

if ('#' in result['next_id']) is False:
    result['next_id'] = definition['sequence_id'] + '#' + result['next_id']

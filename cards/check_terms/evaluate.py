# Incoming globals: definition, response, last_transition, previous_state

result['details'] = {}

result['actions'] = []
result['next_id'] = None

if extras['session'].accepted_terms():
    result['next_id'] = definition.get('accepted', None)
else:
    result['next_id'] = definition.get('not_accepted', None)

if result['next_id'] is not None and ('#' in result['next_id']) is False:
    result['next_id'] = definition['sequence_id'] + '#' + result['next_id']

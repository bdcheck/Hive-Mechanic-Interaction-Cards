import re
import json

# Incoming globals: definition, response, last_transition, previous_state

result['details'] = {}

result['actions'] = []
result['next_id'] = None

value = extras['session'].fetch_variable(definition['variable'])

if value is None:
    value = ''
    
result['details']['fetched'] = value
result['details']['variable'] = definition['variable']
result['actions'] = []
result['next_id'] = None

for pattern_def in definition['patterns']:
    pattern = re.compile(pattern_def['pattern'], re.IGNORECASE)

    if result['next_id'] is None and pattern.match(value) is not None:
        result['next_id'] = pattern_def['action']
        result['matched_pattern'] = pattern_def['pattern']

if result['next_id'] is None and definition['not_found_action'] is not None:
    result['next_id'] = definition['not_found_action']
    result['matched_pattern'] = 'no-matches-found'

if result['next_id'] is not None and ('#' in result['next_id']) is False:
    result['next_id'] = definition['sequence_id'] + '#' + result['next_id']

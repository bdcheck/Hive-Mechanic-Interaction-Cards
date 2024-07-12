# Incoming globals: definition, response, last_transition, previous_state

# Definition Example
#      {
#        "player": "+15554449999",
#        "activity": "my-activity",
#        "next": "next-step",
#        "type": "launch-sesssion",
#        "id": "launch-session-1",
#        "name": "Launch External Phone Session"
#      },
#
# Must populate:
#   result = {
#       'details': {},
#       'actions': [],
#       'next_id': None
#   }

result['details'] = {
    'activity': definition['activity'],
    'player': definition['player'],
}

result['actions'] = []

result['next_id'] = definition['next']

if ('#' in result['next_id']) is False:
    result['next_id'] = definition['sequence_id'] + '#' + result['next_id']

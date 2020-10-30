# Incoming globals: definition, response, last_transition, previous_state

# Definition Example
#      {
#        "image": "https://upload.wikimedia.org/wikipedia/commons/5/54/Welcome_sign_at_Wrigley.jpg", 
#        "type": "send-picture", 
#        "id": "wrigley-sign-example", 
#        "name": "Show Sign Example", 
#        "next": "instruction-3"
#      }, 
#
# Must populate:
#   result = {
#       'details': {},
#       'actions': [],
#       'next_id': None
#   }

result['details'] = {
    'image-url': definition['image']
}

result['actions'] = []

result['next_id'] = definition['next']

if ('#' in result['next_id']) is False:
    result['next_id'] = definition['sequence_id'] + '#' + result['next_id']

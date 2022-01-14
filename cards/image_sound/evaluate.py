# Incoming globals: definition, response, last_transition, previous_state

image = {
    'type': 'set-variable',
    'name': definition['name'],
    'value': 'current_image',
    'variable': definition['image']

}

if 'scope' in definition:
    image['scope'] = definition['scope']

result['actions'].append(image)

sound = {
    'type': 'set-variable',
    'name': definition['name'],
    'value': 'current_sound',
    'variable': definition['sound']
}

if 'scope' in definition:
    sound['scope'] = definition['scope']

result['actions'].append(sound)

result['next_id'] = definition['next']

if ('#' in result['next_id']) is False:
    result['next_id'] = definition['sequence_id'] + '#' + result['next_id']

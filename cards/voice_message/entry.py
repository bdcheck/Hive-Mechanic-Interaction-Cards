actions.append({
    'type': 'echo-voice',
    'message': definition['message'],
    'next_action': definition.get('next_action', 'continue'),
    'parameters': definition
})

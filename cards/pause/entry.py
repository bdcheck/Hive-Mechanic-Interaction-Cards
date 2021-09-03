import arrow

variable = definition['id'] + '-pause-duration'

actions.append({
    'type': 'set-variable',
    'name': definition['name'],
    'variable': variable,
    'value': arrow.utcnow().isoformat(),
    'scope': 'session'
})

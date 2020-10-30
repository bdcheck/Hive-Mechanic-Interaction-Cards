variable = {
    'type': 'set-variable',
    'name': definition['name'],
    'variable': definition['variable'],
    'value': definition['value']
}

if 'scope' in definition:
    variable['scope'] = definition['scope']

actions.append(variable)

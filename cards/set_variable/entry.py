variable = {
    'type': 'set-variable',
    'name': definition['name'],
    'variable': definition['variable'],
    'value': definition['value'],
    'metadata': {}
}

scope = definition.get('scope', None)

if scope is not None:
    variable['scope'] = scope

needs_moderation = definition.get('needs_moderation', None)

if needs_moderation:
    variable['metadata']['moderation_status'] = None

actions.append(variable)

import arrow

from django.utils import timezone

variable = {
    'type': 'set-variable',
    'name': definition['name'],
    'variable': definition['variable'],
    'metadata': {}
}

scope = definition.get('scope', None)

if scope is not None:
    variable['scope'] = scope

needs_moderation = definition.get('needs_moderation', None)

if needs_moderation:
    variable['metadata']['moderation_status'] = None

when = definition.get('value', '').lower()

when_dt = None

if when in ['[now]', '[today]', '[clock_time]', '[calendar_date]']:
    when_dt = arrow.get(timezone.localtime(timezone.now()).isoformat())
else:
    when_dt = arrow.get(when)

if when_dt is not None:
    adjustment = definition.get('adjustment', '').lower()
    quantity = definition.get('quantity', 0)
    units = definition.get('units', 0)

    if adjustment == 'subtract':
        quantity = 0 - float(quantity)

    if adjustment in ['add', 'subtract']:
        args = {
            units: quantity,
        }

        when_dt = when_dt.shift(**args)

if when == '[clock_time]':
    variable['value'] = 'time:%s' % when_dt.format('HH:mm:ss')
elif when == '[today]':
    variable['value'] = 'date:%s' % when_dt.format('YYYY-MM-DD')
elif when == '[calendar_date]':
    variable['value'] = 'calendar_date:%s' % when_dt.format('MM-DD')
else: # if when == '[now]':
    variable['value'] = 'datetime:%s' % when_dt.isoformat()

actions.append(variable)

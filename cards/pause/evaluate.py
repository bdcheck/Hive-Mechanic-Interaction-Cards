import logging

import arrow

# Incoming globals: definition, response, last_transition, previous_state

logger = logging.getLogger('db')

variable = definition['id'] + '-pause-duration'

value = extras['session'].fetch_variable(variable)

result['actions'] = []

if value is None or value == '':
    logger.info('No variable set: ' + variable + '!')
else:
    pause_start = arrow.get(value)
    pause_end = pause_start.shift(seconds=int(definition['duration']))

    now = arrow.get()

    if now > pause_end:
        result['details'] = {
            'resumed': now.isoformat()
        }

        result['next_id'] = definition['next']

        if ('#' in result['next_id']) is False:
            result['next_id'] = definition['sequence_id'] + '#' + result['next_id']
    else:
        result['next_id'] = None
import json
import logging

import arrow

# Incoming globals: definition, response, last_transition, previous_state

logger = logging.getLogger('db')

variable = definition['id'] + '-pause-duration'

value = extras['session'].fetch_variable(variable)

if value is None or value == '':
    logger.info('No variable set: ' + variable + '!')

    extras['session'].set_variable(variable, arrow.utcnow(). isoformat())
else:
    logger.info('Has variable: ' + variable + ' = ' + value)

    pause_start = arrow.get(value)
    pause_end = pause_start.shift(seconds=int(definition['duration']))
    
    now = arrow.get()
    
    if now > pause_end:
        extras['session'].set_variable(variable, '')

        result['details'] = {
            'resumed': now.isoformat()
        }

        result['actions'] = []

        result['next_id'] = definition['next']

        if ('#' in result['next_id']) is False:
            result['next_id'] = definition['sequence_id'] + '#' + result['next_id']
    else:
        result['actions'] = []

        result['next_id'] = None

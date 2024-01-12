# pylint: disable=line-too-long

import datetime
import logging
import re

from django.utils import timezone

# Incoming globals: definition, response, last_transition, previous_state

# Definition Example
#      {
#        "not_found_action": "request-consent-2",
#        "name": "Process Consent Response",
#        "patterns": [
#          {
#            "action": "continue-intro",
#            "pattern": "^[Yy]"
#          },
#          {
#            "action": "nonconsent-thanks-2",
#            "pattern": "^[Nn]"
#          }
#        ],
#        "timeout": {
#          "duration": 4,
#          "units": "hour",
#          "action": "consent-timeout"
#        },
#        "type": "process-response",
#        "id": "process-consent"
#      },

logger = logging.getLogger('db')

result['details'] = {}

result['actions'] = []
result['next_id'] = None

if response is not None:
    result['details']['response'] = response
    result['actions'] = []
    result['next_id'] = None

    next_id = None

    for pattern_def in definition['patterns']:
        action = pattern_def.get('action', '')
        pattern_str = pattern_def.get('pattern', '')

        raw_pattern = pattern_str.replace('$', '').replace('^', '').replace('[', '').replace(']', '').replace('*', '').strip()

        if action != '' and raw_pattern != '':
            pattern = re.compile(pattern_str, re.IGNORECASE)

            if result['next_id'] is None and pattern.match(response) is not None:
                result['next_id'] = action
                result['matched_pattern'] = pattern_str

    if result['next_id'] is None and definition['not_found_action'] is not None:
        result['next_id'] = definition['not_found_action']
        result['matched_pattern'] = 'no-matches-found'
elif 'timeout' in definition:
    units = definition['timeout'].get('units', None)
    duration = int(definition['timeout'].get('duration', '0'))

    if units is not None and duration > 0:
        test = timezone.now()

        if 'units' in definition['timeout'] and 'duration' in definition['timeout']:
            duration = int(definition['timeout']['duration'])

            if definition['timeout']['units'] == 'second':
                test = test - datetime.timedelta(seconds=duration)
            elif definition['timeout']['units'] == 'minute':
                test = test - datetime.timedelta(seconds=(duration * 60)) # pylint: disable=superfluous-parens
            elif definition['timeout']['units'] == 'hour':
                test = test - datetime.timedelta(seconds=(duration * 60 * 60)) # pylint: disable=superfluous-parens
            elif definition['timeout']['units'] == 'day':
                test = test - datetime.timedelta(days=duration)
            else:
                logger.info('Invalid duration = %d, and units = %s', str(duration), str(definition['timeout']['units']))

        if last_transition < test:
            result['next_id'] = definition['timeout']['action']
        else:
            result['next_id'] = definition['id']

if result['next_id'] is not None and ('#' in result['next_id']) is False:
    result['next_id'] = definition['sequence_id'] + '#' + result['next_id']

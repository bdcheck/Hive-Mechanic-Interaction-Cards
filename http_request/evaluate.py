import re
import json

import requests

# Incoming globals: definition, response, last_transition, previous_state

# Definition Example
# {
#    "name": cardName,
#    "patterns": [],
#    "request_variables": [],
#    "http_method": "get",
#    "url": "http://www.example.com",
#    "type": "http-request",
#    "id": Node.uuidv4()
# }

logger.info('HTTP REQUEST')
logger.info('DEF: ' + json.dumps(definition, indent=2))
logger.info('EXTRAS: ' + str(extras))

result['details'] = {}

result['actions'] = []
result['next_id'] = None

payload = {}

if 'request_variables' in definition:
    for pair in definition['request_variables']:
        payload[pair['name']] = pair['value']

response = None

if ('timeout' in definition) is False:
    definition['timeout'] = '30'

try:
    if definition['http_method'] == 'post':
        response = requests.post(definition['url'], params=payload, timeout=float(definition['timeout']))
    else:
        response = requests.get(definition['url'], params=payload, timeout=float(definition['timeout']))
except requests.exceptions.Timeout:
    result['next_id'] = definition['timeout_action']

if response.status_code == 200:
    for pattern_def in definition['patterns']:
        logger.info('MATCH? ' + pattern_def['pattern'] + ' / ' + str(response.text.encode('ascii',errors='ignore')) + ' --> ' + str(re.search(pattern_def['pattern'], response.text)))

        pattern = re.compile(pattern_def['pattern'], re.IGNORECASE)

        if result['next_id'] is None and pattern.search(response.text) is not None:
            result['next_id'] = pattern_def['action']
            result['matched_pattern'] = pattern_def['pattern']
elif response.status_code == 404:
    result['next_id'] = definition['not_found_action']
elif response.status_code == 500:
    result['next_id'] = definition['server_error_action']

logger.info(u'RESPONSE TEXT: ' + str(len(response.text)))

result['details']['url'] = response.url
result['details']['method'] = definition['http_method']
result['details']['parameters'] = payload
result['details']['status_code'] = response.status_code
result['actions'] = []

if result['next_id'] is None:
    result['next_id'] = definition['not_found_action']

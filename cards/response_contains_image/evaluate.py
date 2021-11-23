# pylint: disable=line-too-long

# Definition Example
#      {
#        "has_image_action": "request-consent-2",
#        "no_image_action": "request-consent-2",
#        "name": "Process Consent Response",
#        "type": "response-contains-image",
#        "id": "response-contains-image"
#      },

result['details'] = {}

result['actions'] = []
result['next_id'] = None

if 'extras' in extras:
    if extras['extras'] is not None and 'last_message' in extras['extras']:
        if extras['extras']['last_message'] is not None:
            image_count = extras['extras']['last_message'].media.filter(content_type__startswith='image/').count()

            if image_count > 0:
                result['next_id'] = definition['has_image_action']

if result['next_id'] is None:
    result['next_id'] = definition['no_image_action']

if result['next_id'] is not None and ('#' in result['next_id']) is False:
    result['next_id'] = definition['sequence_id'] + '#' + result['next_id']

if 'extras' in extras and extras['extras'] is None:
    result['next_id'] = None

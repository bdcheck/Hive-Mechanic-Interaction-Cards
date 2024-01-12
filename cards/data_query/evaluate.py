# pylint: disable=line-too-long, useless-object-inheritance, too-few-public-methods, redefined-outer-name, reimported, import-outside-toplevel

import json
import logging

from django.utils.encoding import smart_str

from builder.models import DataProcessor # pylint: disable=import-error

logger = logging.getLogger('db')

result['details'] = {
    'data-processor': definition['processor']
}

result['actions'] = []

class LogGetFunction(object):
    def __init__(self, processor_obj, session, context_obj):
        self.processor = processor_obj
        self.session = session
        self.context = context_obj

    def __call__(self, *args, **kwargs):
        import json
        import requests
        from django.utils import timezone
        from builder.models import DataProcessorLog # pylint: disable=import-error

        response = requests.get(*args, **kwargs) # pylint: disable=missing-timeout # nosec

        request_payload = json.dumps(kwargs.get('params', {}), indent=2)

        DataProcessorLog.objects.create(data_processor=self.processor, method='GET', url=response.url, requested=timezone.now(), request_payload=json.dumps(request_payload, indent=2), response_status=response.status_code, response_payload=response.text, session=self.session, player=self.session.player, game=self.session.game_version.game, context=json.dumps(self.context, indent=2))

        return response

class LogPostFunction(object):
    def __init__(self, processor_obj, session, context_obj):
        self.processor = processor_obj
        self.session = session
        self.context = context_obj

    def __call__(self, *args, **kwargs):
        import json
        import requests
        from django.utils import timezone
        from builder.models import DataProcessorLog # pylint: disable=import-error

        response = requests.post(*args, **kwargs) # pylint: disable=missing-timeout # nosec

        request_payload = kwargs.get('data', None)

        if request_payload is None:
            request_payload = kwargs.get('json', {})

        DataProcessorLog.objects.create(data_processor=self.processor, method='POST', url=response.url, requested=timezone.now(), request_payload=json.dumps(request_payload, indent=2), response_status=response.status_code, response_payload=response.text, session=self.session, player=self.session.player, game=self.session.game_version.game, context=json.dumps(self.context, indent=2))

        return response

processor = DataProcessor.objects.filter(identifier=definition['processor']).first()

if processor is not None:
    context = None

    if definition['scope'] == 'session':
        context = extras['session'].fetch_session_context()
    elif definition['scope'] == 'player':
        context = extras['session'].fetch_player_context()
    elif definition['scope'] == 'game':
        context = extras['session'].fetch_game_context()

    if context is None:
        logger.info('Unable to fetch appropriate context: %s', definition['scope'])
    else:
        original_context = context.copy()

        context['session_id'] = extras['session'].pk

        code = compile(smart_str(processor.processor_function), '<string>', 'exec')

        metadata = {}

        if processor.metadata is not None:
            metadata = json.loads(processor.metadata)

        local_env = {
            'metadata': metadata,
            'context': context,
            'log_get': LogGetFunction(processor, extras.get('session', None), context),
            'log_post': LogPostFunction(processor, extras.get('session', None), context),
        }

        eval(code, local_env, {}) # nosec # pylint: disable=eval-used

        for key in context:
            if key in original_context and context[key] == original_context[key]:
                pass # No change - do nothing
            else:
                variable = {
                    'type': 'set-variable',
                    'name': definition['name'],
                    'variable': key,
                    'value': context[key]
                }

                if 'scope' in definition:
                    variable['scope'] = definition['scope']

                result['actions'].append(variable)
else:
    logger.info('Unable to locate DataProcessor: %s', definition['processor'])

result['next_id'] = definition['next']

if ('#' in result['next_id']) is False:
    result['next_id'] = definition['sequence_id'] + '#' + result['next_id']

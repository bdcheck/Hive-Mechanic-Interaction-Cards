# pylint: disable=line-too-long

import json
import logging

from django.utils.encoding import smart_str

from builder.models import DataProcessor # pylint: disable=import-error

logger = logging.getLogger('db')

result['details'] = {
    'data-processor': definition['processor']
}

result['actions'] = []

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

        code = compile(smart_str(processor.processor_function), '<string>', 'exec')

        metadata = {}

        if processor.metadata is not None:
            metadata = json.loads(processor.metadata)

        local_env = {
            'metadata': metadata,
            'context': context
        }

        try:
            local_env.update(data_processor_environment)
        except: # pylint: disable=bare-except
            pass

        eval(code, {}, local_env) # nosec # pylint: disable=eval-used

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

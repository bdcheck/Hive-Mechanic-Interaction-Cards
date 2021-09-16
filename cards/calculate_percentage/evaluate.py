# Incoming globals: definition, response, last_transition, previous_state
import logging
from builder.models import DataPoint

logger = logging.getLogger('db')

if 'scope' not in definition:
    l_scope = 'player'
else:
    l_scope = definition['scope']

variable_name = definition['variable']

game = extras['session'].game_version.game
slug = game.slug

point_list = DataPoint.objects.filter(secondary_identifier=variable_name, properties__scope=l_scope, properties__game=slug)
total = point_list.count()

logger.info("total points %d",total)
if not point_list:
    logger.info('Unable to fetch data point: %s', variable_name)
else:
    if l_scope == "player":
        context = extras['session'].player
    elif l_scope == 'game':
        context = game
    else:
        context = extras['session']

    value = context.fetch_variable(variable_name)
    counted = point_list.filter(properties__value=value)
    count = counted.count()

    if total == 0 or count == 0:
        percent = 0
    else:
        percent = round(count*100/total)

    variable = {
        'type': 'set-variable',
        'name':  definition['name'],
        'variable': variable_name + '_total',
        'value': total,
        'scope': l_scope
    }

    result['actions'].append(variable)
    variable = {
        'type': 'set-variable',
        'name':  definition['name'],
        'variable': variable_name + '_count',
        'value': count,
        'scope': l_scope
    }
    result['actions'].append(variable)
    variable = {
        'type': 'set-variable',
        'name':  definition['name'],
        'variable': variable_name + '_percent',
        'value': percent,
        'scope': l_scope
    }
    result['actions'].append(variable)

result['next_id'] = definition['next']
if ('#' in result['next_id']) is False:
    result['next_id'] = definition['sequence_id'] + '#' + result['next_id']

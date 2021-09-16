# Incoming globals: definition, response, last_transition, previous_state
import logging
from builder.models import DataPoint
import arrow
logger = logging.getLogger('db')


if 'scope' not in definition:
    l_scope = 'player'
else:
    l_scope = definition['scope']

if 'start_time' in definition:
    date = arrow.get(definition['start_time'], "MM/DD/YYYY").datetime
    if not date:
        date = False

else:
    date = False

if 'player_latest_answer' in definition and definition['player_latest_answer'] == 'True':
    restrict_player = True
else:
    restrict_player = False

variable_name = definition['variable']

game = extras['session'].game_version.game
slug = game.slug
player = extras['session'].player
player_name = player.identifier
point_list = DataPoint.objects.filter(secondary_identifier=variable_name, properties__scope=l_scope, properties__game=slug)

if restrict_player:
    point_list = point_list.exclude(source=player_name)
if date:
    point_list = point_list.filter(created__gte=date)

if l_scope == "player":
    context = player
elif l_scope == 'game':
    context = game
else:
    context = extras['session']

total = point_list.count()
logger.info("total points %d", total)
value = context.fetch_variable(variable_name)
counted = point_list.filter(properties__value=value)
count = counted.count()
logger.info("total people with same answer %d", count)

#add players data back in
if restrict_player:
    count += 1
    total += 1

if total == 0 or count == 0:
    percent = 0
else:
    percent = round(count*100/total)

variable = {
    'type': 'set-variable',
    'name':  definition['name'],
    'variable': variable_name + '_cp_total',
    'value': total,
    'scope': l_scope
}

result['actions'].append(variable)
variable = {
    'type': 'set-variable',
    'name':  definition['name'],
    'variable': variable_name + '_cp_matched',
    'value': count,
    'scope': l_scope
}
result['actions'].append(variable)
variable = {
    'type': 'set-variable',
    'name':  definition['name'],
    'variable': variable_name + '_cp_percentage',
    'value': percent,
    'scope': l_scope
}
result['actions'].append(variable)

result['next_id'] = definition['next']
if ('#' in result['next_id']) is False:
    result['next_id'] = definition['sequence_id'] + '#' + result['next_id']

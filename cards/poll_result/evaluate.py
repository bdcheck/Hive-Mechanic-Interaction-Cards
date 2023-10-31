# Incoming globals: definition, response, last_transition, previous_state

logger = Logging.getLogger('db') # pylint: disable=undefined-variable
logger.info('Hello?')

counts = {}

for player in Player.objects.all(): # pylint: disable=undefined-variable
    player_state = player.player_state

    vote_value = player_state.get('poll-response', None)
    did_vote = player_state.get('player-vote', None)

    if vote_value is not None and did_vote is not None and did_vote == 'Yes':
        count = counts.get(vote_value, 0)
        count += 1
        counts[vote_value] = count

message = 'results are:'

for value in counts:
    message += '\\n%s: %s' % (value, count)

result['details'] = {
    'name': definition['variable'],
    'value': message,
}

if 'scope' in definition:
    result['scope'] = definition['scope']

result['actions'] = []

result['next_id'] = definition['next']

if ('#' in result['next_id']) is False:
    result['next_id'] = definition['sequence_id'] + '#' + result['next_id']

context = extras['session'].fetch_session_context()
context['result_of_poll'] = message

# send message

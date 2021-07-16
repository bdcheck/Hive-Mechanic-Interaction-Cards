# pylint: disable=line-too-long

import logging

import requests

logger = logging.getLogger('db')

# Provided variables: context, metadata
# API used: https://positionstack.com/documentation

url = 'http://api.positionstack.com/v1/forward'

if 'hive_physical_location_description' in context:
    params = {
        'access_key': metadata['api_key'],
        'query': context['hive_physical_location_description']
    }

    response = requests.get(url, params=params)

    response.raise_for_status()

    results = response.json()

    logger.info('RESPONSE: %s', response.text)

    positions = results['data']

    if positions:
        positions.sort(key=lambda position: position['confidence'], reverse=True)

        best_guess = positions[0]

        if 'positionstack_error' in context:
            del context['positionstack_error']

        for key in best_guess:
            context['positionstack_' + key] = best_guess[key]

        # Standard Hive keys for latitude and longitute

        context['hive_physical_location_latitude'] = best_guess['latitude']
        context['hive_physical_location_longitude'] = best_guess['longitude']

    else:
        context['positionstack_error'] = 'Unable to geocode location from description "' + context['hive_physical_location_description'] + '".'
else:
    context['positionstack_error'] = 'Physical location description (hive_physical_location_description) was not available in the provided context.'

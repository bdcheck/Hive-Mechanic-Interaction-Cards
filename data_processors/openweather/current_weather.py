# pylint: disable=line-too-long

import requests

# Provided variables: context, metadata
# API used: https://openweathermap.org/current

url = 'https://api.openweathermap.org/data/2.5/weather'

global store_structure # pylint: disable=global-at-module-level

def store_structure(context, content, prefix=''):
    if isinstance(content, dict):
        for key, value in content.items():
            new_prefix = prefix + '_' + key

            while new_prefix.startswith('_'):
                new_prefix = new_prefix[1:]

            store_structure(context, value, prefix=new_prefix)
    elif isinstance(content, (list, tuple,)):
        for i in range(0, len(content)): # pylint: disable=consider-using-enumerate
            list_item = content[i]

            new_prefix = prefix + '_' + str(i)

            while new_prefix.startswith('_'):
                new_prefix = new_prefix[1:]

            store_structure(context, list_item, prefix=new_prefix)
    else:
        context[prefix] = content

if 'hive_physical_location_latitude' in context and 'hive_physical_location_longitude' in context:
    params = {
        'lat': str(context['hive_physical_location_latitude']),
        'lon': str(context['hive_physical_location_longitude']),
        'appid': metadata['api_key'],
        'units': 'metric'
    }

    if 'units' in metadata:
        params['units'] = metadata['units']

    response = requests.get(url, params=params)

    response.raise_for_status()

    weather_details = response.json()

    store_structure(context, weather_details, prefix='openweather')
else:
    context['openweather_error'] = 'Location information (hive_physical_location_latitude, hive_physical_location_longitude) was not available in the provided context.'

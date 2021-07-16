import arrow
import requests

# Provided variables: context, metadata
# API used: https://developer.wmata.com/docs/services/54763629281d83086473f231/operations/5476362a281d830c946a3d6d?

url = 'https://api.wmata.com/Bus.svc/json/jStops'

def distance_between(lat_one, lon_one, lat_two, lon_two):
    # Manhattan distance in degrees - should use better math.

    return abs(lat_one - lat_two) + abs(lon_one - lon_two)

if 'hive_physical_location_latitude' in context and 'hive_physical_location_longitude' in context:
    params = {
        'Lat': str(context['hive_physical_location_latitude']),
        'Lon': str(context['hive_physical_location_longitude'])
    }

    headers = {
        'api_key': metadata['api_key']
    }

    response = requests.get(url, params=params, headers=headers)

    response.raise_for_status()

    stops_details = response.json()

    future_stops = []

    now = arrow.now()

    for stop_detail in stops_details['Stops']:
        stop_detail['distance'] = distance_between(context['hive_physical_location_latitude'], context['hive_physical_location_longitude'], stop_detail['Lat'], stop_detail['Lon'])

    stops_details['Stops'].sort(key=lambda stop: stop['distance'])

    nearest_stop = stops_details['Stops'][0]

    if 'wmata_nearest_bus_arrival_error' in context:
        del context['wmata_nearest_bus_arrival_error']

    for key in nearest_stop:
        context['wtama_nearest_bus_stop_' + key] = nearest_stop[key]

    context['wtama_bus_stop_id'] = nearest_stop['StopID']
else:
    context['wmata_nearest_bus_arrival_error'] = 'Location information (hive_physical_location_latitude, hive_physical_location_longitude) was not available in the provided context.'

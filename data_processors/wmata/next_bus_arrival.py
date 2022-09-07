# pylint: disable=line-too-long

import arrow
import requests

# Provided variables: context, metadata
# API used: https://developer.wmata.com/docs/services/54763629281d83086473f231/operations/5476362a281d830c946a3d6c?

url = 'https://api.wmata.com/Bus.svc/json/jStopSchedule'

if 'wtama_bus_stop_id' in context:
    params = {
        'StopID': context['wtama_bus_stop_id']
    }

    headers = {
        'api_key': metadata['api_key']
    }

    response = requests.get(url, params=params, headers=headers, timeout=300)

    response.raise_for_status()

    stop_details = response.json()

    future_stops = []

    now = arrow.now()

    for arrival in stop_details['ScheduleArrivals']:
        scheduled_time = arrow.get(arrival['ScheduleTime'])

        if scheduled_time > now:
            if ('wtama_bus_route_id' in context) is False or arrival['RouteID'] == context['wtama_bus_route_id']:
                future_stops.append(arrival)

    if future_stops:
        future_stops.sort(key=lambda stop: stop['ScheduleTime'])

        next_stop = future_stops[0]

        if 'wtama_next_bus_stop_none' in context:
            del context['wtama_next_bus_stop_none']

        context['wtama_next_bus_stop_present'] = 'true'

        for key in next_stop:
            context['wtama_next_bus_stop_' + key] = next_stop[key]

        scheduled_time = arrow.get(next_stop['ScheduleTime'])

        context['wtama_next_bus_stop_schedule_time_humanized'] = scheduled_time.humanize()
        context['wtama_next_bus_stop_schedule_time_am_pm'] = scheduled_time.format('h:mm A')
        context['wtama_next_bus_stop_schedule_time_24_hour'] = scheduled_time.format('H:mm')
    else:
        context['wtama_next_bus_stop_present'] = 'false'

        if ('wtama_bus_route_id' in context) is False:
            context['wtama_next_bus_stop_none'] = 'No upcoming stops today for stop ' + context['wtama_bus_stop_id'] + '.'
        else:
            context['wtama_next_bus_stop_none'] = 'No upcoming stops today for stop ' + context['wtama_bus_stop_id'] + ', route ' + context['wtama_bus_route_id'] + '.'
else:
    context['wmata-next-bus-arrival-error'] = 'Bus stop ID (wtama_bus_stop_id) was not available in the provided context.'

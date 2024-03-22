# Incoming variables: context, request, response, status_code

context['log_summary'] = 'Open Weather: Weather for coordinates at "(%s, %s)"' % (context.get('hive_physical_location_latitude', None), context.get('hive_physical_location_longitude', None))


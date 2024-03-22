# pylint: disable=line-too-long
# Incoming variables: context, request, response, status_code

context['log_summary'] = 'WMATA: Bus stop nearest to "%s, %s"' % (context.get('hive_physical_location_latitude', None), context.get('hive_physical_location_longitude', None))

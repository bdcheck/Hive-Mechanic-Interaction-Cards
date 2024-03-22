# pylint: disable=line-too-long, undefined-variable
# Incoming variables: context, request, response, status_code

context['log_summary'] = 'positionstack: Geocode coordinates for "%s"' % context.get('hive_physical_location_description', None)

# pylint: disable=line-too-long
# Incoming variables: context, request, response, status_code

nw_lat = request.get('nwlat', None)
nw_long = request.get('nwlng', None)

se_lat = request.get('selat', None)
se_long = request.get('selng', None)

context['log_summary'] = 'Purple Air: Sensors between (%s, %s) and (%s, %s)' % (nw_lat, nw_long, se_lat, se_long)

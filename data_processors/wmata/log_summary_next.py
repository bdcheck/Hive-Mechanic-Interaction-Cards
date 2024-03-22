# Incoming variables: context, request, response, status_code

context['log_summary'] = 'WMATA: Next bus stop for "%s"' % context.get('wtama_bus_stop_id', None)

# Incoming variables: context, request, response, status_code

context['log_summary'] = 'Yelp: Restaurants nearest "%s' % context.get('yelp_nearest_open_restaurant_location', None)

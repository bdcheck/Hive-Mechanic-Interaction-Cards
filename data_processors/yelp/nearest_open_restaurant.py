# pylint: disable=line-too-long

import requests

url = 'https://api.yelp.com/v3/businesses/search'

if 'yelp_nearest_open_restaurant_location' in context:
    location = context['yelp_nearest_open_restaurant_location']

    # define the parameters yelp searches by
    # location is currently from hivemind the rest is static
    params = {
        'location': location,
        'term': 'restaurants',
        'open_now': 'true',
        'sort_by': 'distance'
    }

    # API key from yelp
    headers = {
        'Authorization': 'Bearer ' + metadata['api_key']
    }

    # call the yelp API and get response, either errors or the json
    response = requests.get(url, params=params, headers=headers)
    response.raise_for_status()
    resp = response.json()
    # yelp returns json with a list of businesses
    res = resp['businesses']

    # take first business
    business = res[0]

    # retrieve pertinent data
    address = '\n'.join(business['location']['display_address'])
    name = business['name']
    lat = business['coordinates']['latitude']
    lng = business['coordinates']['longitude']

    # return the data to be used somewhere else
    context['yelp_nearest_open_restaurant_name'] = name
    context['yelp_nearest_open_restaurant_address'] = address
    context['yelp_next_lat'] = str(lat)
    context['yelp_next_lng'] = str(lng)
else:
    # default error when location is not specified
    context['yelp_nearest_open_restaurant_error'] = 'No location specified'
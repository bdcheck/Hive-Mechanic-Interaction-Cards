# pylint: disable=line-too-long

# Input: Diameter (in miles)
# Output: Coordinates of edges of square boundary around player

def generateSquareBoundary(search_range, latitude, longitude):
    """Calculates a square boundary around the player's current location.
    Then generates a url to search for PurpleAir sensors in that area.
    """

    one_mile_degree = 1 / float(69)  # Each degree of latitude is approximately 69 miles apart.
    search_radius = search_range / 2 * one_mile_degree

    nwlat = float(latitude) + search_radius
    selat = float(latitude) - search_radius
    nwlng = float(longitude) - search_radius
    selng = float(longitude) + search_radius

    return 'https://www.purpleair.com/data.json?opt=1/i/mAQI/a10/cC0&fetch=true&nwlat=%f&selat=%f&nwlng=%f&selng=%f&fields=pm_2' % (nwlat, selat, nwlng, selng)

# Ensure that Hive has successfully gathered the user's coordinates before proceeding.
# If data isn't found, record the error to Hive.

if 'hive_physical_location_latitude' in context and 'hive_physical_location_longitude' in context:
    latitude = str(context['hive_physical_location_latitude'])
    longitude = str(context['hive_physical_location_longitude'])

    full_url = generateSquareBoundary(50, latitude, longitude)

    response = log_get(full_url, timeout=300)

    response.raise_for_status()

    response_json = response.json()

    pm25_column_number = 2
    sensor_name_column_number = 5
    lat_column_number = 6
    lon_column_number = 7

    response_json['fields'].append('Distance_in_miles')  # Add a new field for distance of sensor from the user

    List_of_distances = []

    for (ii, row) in enumerate(J['data']):  # Calculate the distance of each sensor from the user and insert the data into the JSON
        distance_from_sensor = (((float(latitude) - row[lat_column_number]) ** 2 + (float(longitude) - row[lon_column_number]) ** 2) ** .5) * 69  # Calculate the distance away from each sensor (in miles). This is done using Pythagoras theorem, then multiplying by 69 to convert from degrees to miles.
        response_json['data'][ii].append(distance_from_sensor)
        List_of_distances.append(distance_from_sensor)

    if List_of_distances:
        index_of_closest_sensor = List_of_distances.index(min(List_of_distances))

        # TO DO: Use confidence column to eliminate the closest sensor if the next nearest sensor has higher confidence...

        # Save variables to Hive
        context['purpleair_nearest_name'] = str(response_json['data'][index_of_closest_sensor][sensor_name_column_number])
        context['purpleair_nearest_pm25_1hr'] = str(response_json['data'][index_of_closest_sensor][pm25_column_number])
else:
    context['purpleair_error'] = 'Location information (hive_physical_location_latitude, hive_physical_location_longitude) was not available in the provided context.'

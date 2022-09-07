# pylint: disable=line-too-long

import requests

# Input: Diameter (in miles)
# Output: Coordinates of edges of square boundary around player
def generateSquareBoundary(SEARCH_RANGE):
    """Calculates a square boundary around the player's current location.
    Then generates a url to search for PurpleAir sensors in that area.
    """

    DEG_IN_ONE_MILE = 1 / float(69)  # Each degree of latitude is approximately 69 miles apart.
    SEARCH_RADIUS = SEARCH_RANGE / 2 * DEG_IN_ONE_MILE

    nwlat = float(LAT) + SEARCH_RADIUS
    selat = float(LAT) - SEARCH_RADIUS
    nwlng = float(LON) - SEARCH_RADIUS
    selng = float(LON) + SEARCH_RADIUS

    return 'https://www.purpleair.com/data.json?opt=1/i/mAQI/a10/cC0&fetch=true&nwlat=%f&selat=%f&nwlng=%f&selng=%f&fields=pm_2' % (nwlat, selat, nwlng, selng)

# Ensure that Hive has successfully gathered the user's coordinates before proceeding.
# If data isn't found, record the error to Hive.

if 'hive_physical_location_latitude' in context and 'hive_physical_location_longitude' in context:
    LAT = str(context['hive_physical_location_latitude'])
    LON = str(context['hive_physical_location_longitude'])

    full_url = generateSquareBoundary(50)

    response = requests.get(full_url, timeout=300)

    response.raise_for_status()

    J = response.json()

    PM25_COLUMN_NUMBER = 2
    SENSOR_NAME_COLUMN_NUMBER = 5
    LAT_COLUMN_NUMBER = 6
    LON_COLUMN_NUMBER = 7

    J['fields'].append('Distance_in_miles')  # Add a new field for distance of sensor from the user

    List_of_distances = []

    for (ii, row) in enumerate(J['data']):  # Calculate the distance of each sensor from the user and insert the data into the JSON
        Distance_from_sensor = (((float(LAT) - row[LAT_COLUMN_NUMBER]) ** 2 + (float(LON) - row[LON_COLUMN_NUMBER]) ** 2) ** .5) * 69  # Calculate the distance away from each sensor (in miles). This is done using Pythagoras theorem, then multiplying by 69 to convert from degrees to miles.
        J['data'][ii].append(Distance_from_sensor)
        List_of_distances.append(Distance_from_sensor)

    if List_of_distances:
        index_of_closest_sensor = List_of_distances.index(min(List_of_distances))

        # TO DO: Use confidence column to eliminate the closest sensor if the next nearest sensor has higher confidence...

        # Save variables to Hive
        context['purpleair_nearest_name'] = str(J['data'][index_of_closest_sensor][SENSOR_NAME_COLUMN_NUMBER])
        context['purpleair_nearest_pm25_1hr'] = str(J['data'][index_of_closest_sensor][PM25_COLUMN_NUMBER])
else:
    context['purpleair_error'] = 'Location information (hive_physical_location_latitude, hive_physical_location_longitude) was not available in the provided context.'

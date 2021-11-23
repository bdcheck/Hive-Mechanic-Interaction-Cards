import hashlib
import json
import sys

import arrow
import requests

repository = json.load(open(sys.argv[1]))

for key in repository['cards'].keys():
	card_def = repository['cards'][key]

	versions = card_def['versions']

	for version in versions:
		entry_content = requests.get(version['entry-actions']).content
		evaluate_content = requests.get(version['evaluate-function']).content
		client_content = requests.get(version['client-implementation']).content

		computed_hash = hashlib.sha512()

		computed_hash.update(entry_content)
		computed_hash.update(evaluate_content)
		computed_hash.update(client_content)

		local_hash = computed_hash.hexdigest()

		if local_hash != version['sha512-hash']:
			print('[Card: ' + key + ' / ' + str(version['version']) + '] Computed local hash \'' + local_hash + '\'. Found \'' + version['sha512-hash'] + '\' instead.')

		try:
			arrow.get(version['created'])
		except: # pylint: disable=bare-except
			print('[Card: ' + key + ' / ' + str(version['version']) + '] Unable to parse created date: ' + str(version['created']))

for key in repository['data_processors'].keys():
	processor_def = repository['data_processors'][key]

	versions = processor_def['versions']

	for version in versions:
		implemementation_content = requests.get(version['implementation']).content

		computed_hash = hashlib.sha512()

		computed_hash.update(implemementation_content)

		local_hash = computed_hash.hexdigest()

		if local_hash != version['sha512-hash']:
			print('[Data Processor: ' + key + ' / ' + str(version['version']) + '] Computed local hash \'' + local_hash + '\'. Found \'' + version['sha512-hash'] + '\' instead.')

		try:
			arrow.get(version['created'])
		except: # pylint: disable=bare-except
			print('[Data Processor: ' + key + ' / ' + str(version['version']) + '] Unable to parse created date: ' + str(version['created']))

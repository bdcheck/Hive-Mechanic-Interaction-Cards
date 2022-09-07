# pylint: disable=line-too-long

import hashlib
import io
import json
import sys

import arrow
import requests

with io.open(sys.argv[1], mode='r', encoding='utf-8') as repo_file:
    repository = json.load(repo_file)

    for key in repository['cards'].keys():
        card_def = repository['cards'][key]

        versions = card_def['versions']

        for version in versions:
            entry_request = requests.get(version['entry-actions'])
            evaluate_request = requests.get(version['evaluate-function'])
            client_request = requests.get(version['client-implementation'])

            if entry_request.status_code != 200:
                print('%d error retrieving %s' % (entry_request.status_code, version['entry-actions']))

            if evaluate_request.status_code != 200:
                print('%d error retrieving %s' % (evaluate_request.status_code, version['evaluate-function']))

            if client_request.status_code != 200:
                print('%d error retrieving %s' % (client_request.status_code, version['client-implementation']))

            entry_content = entry_request.content
            evaluate_content = evaluate_request.content
            client_content = client_request.content

            computed_hash = hashlib.sha512()

            computed_hash.update(entry_content)
            computed_hash.update(evaluate_content)
            computed_hash.update(client_content)

            local_hash = computed_hash.hexdigest()

            if local_hash != version['sha512-hash']:
                print('[Card: %s / %.1f] Computed local hash \'%s\'. Found \'%s\' instead.' % (key, version['version'], local_hash, version['sha512-hash']))

            try:
                arrow.get(version['created'])
            except: # pylint: disable=bare-except
                print('[Card: %s / %.1f] Unable to parse created date: %s' % (key, version['version'], version['created']))

    for key in repository['data_processors'].keys():
        processor_def = repository['data_processors'][key]

        versions = processor_def['versions']

        for version in versions:
            implemementation_request = requests.get(version['implementation'])

            if implemementation_request.status_code != 200:
                print('%d error retrieving %s' % (implemementation_request.status_code, version['implementation']))

            implemementation_content = implemementation_request.content

            computed_hash = hashlib.sha512()

            computed_hash.update(implemementation_content)

            local_hash = computed_hash.hexdigest()

            if local_hash != version['sha512-hash']:
                print('[Data Processor: %s / %.1f] Computed local hash \'%s\'. Found \'%s\' instead.' % (key, version['version'], local_hash, version['sha512-hash']))

            try:
                arrow.get(version['created'])
            except: # pylint: disable=bare-except
                print('[Data Processor: %s / %.1f] Unable to parse created date: %s' % (key, version['version'], version['created']))

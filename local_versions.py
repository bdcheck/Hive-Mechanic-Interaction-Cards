import difflib
import hashlib
import json
import sys

import arrow
import requests

repository = json.load(open(sys.argv[1]))

for key in repository['cards'].keys():
    card_def = repository['cards'][key]

    versions = card_def['versions']

    latest_version = sorted(versions, key=lambda version: version['version'], reverse=True)[0]

    remote_entry_content = requests.get(latest_version['entry-actions'], timeout=300).text
    remote_evaluate_content = requests.get(latest_version['evaluate-function'], timeout=300).text
    remote_client_content = requests.get(latest_version['client-implementation'], timeout=300).text

    prefix_index = latest_version['entry-actions'].index('/cards/') + 1

    entry_content_path = latest_version['entry-actions'][prefix_index:]
    evaluate_content_path = latest_version['evaluate-function'][prefix_index:]
    client_content_path = latest_version['client-implementation'][prefix_index:]

    local_entry_content = ''

    with open(entry_content_path, 'r', encoding='utf-8') as input_file:
        local_entry_content = input_file.read()

    local_evaluate_content = ''

    with open(evaluate_content_path, 'r', encoding='utf-8') as input_file:
        local_evaluate_content = input_file.read()

    local_client_content = ''

    with open(client_content_path, 'r', encoding='utf-8') as input_file:
        local_client_content = input_file.read()

    if remote_entry_content != local_entry_content:
        print('[Card: ' + key + ' / entry-actions] Local file differs from remote file.')
        print(remote_entry_content)
        print('-----')
        print(local_entry_content)

    if remote_evaluate_content != local_evaluate_content:
        print('[Card: ' + key + ' / evaluate-function] Local file differs from remote file.')
        print(remote_evaluate_content)
        print(str(len(remote_evaluate_content)))
        print('-----')
        print(local_evaluate_content)
        print(str(len(local_evaluate_content)))

    if remote_client_content != local_client_content:
        print('[Card: ' + key + ' / client-implementation] Local file differs from remote file.')
        print(remote_client_content)
        print('-----')
        print(local_client_content)

    computed_hash = hashlib.sha512()

    computed_hash.update(local_entry_content.encode('utf-8'))
    computed_hash.update(local_evaluate_content.encode('utf-8'))
    computed_hash.update(local_client_content.encode('utf-8'))

    local_hash = computed_hash.hexdigest()

    if latest_version['sha512-hash'] != local_hash:
        print('[Card: ' + key + ' / hash] ' + local_hash)

'''
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
'''

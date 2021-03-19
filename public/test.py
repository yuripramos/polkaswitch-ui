#!/usr/bin/python
import os
import sys
import shutil
import json

input_file = open('tokens/erc20.json')
json_array = json.load(input_file)
store_list = []

for item in json_array:
    store_list.append(item['id'])
    print("moving %s" % item['name'])
    try:
        shutil.move('tokens/erc20/%s' % item['id'], 'tokens/erc20/safe/%s' % item['id'])
    except IOError as err:
        print("couldn't move %s" % item['name'])



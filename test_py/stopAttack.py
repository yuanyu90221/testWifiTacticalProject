#! /usr/bin/python

import json
import StringIO
import sys
import os

from subprocess import check_output
from pprint     import pprint

statusFilePath  = 'FakeAPAttack.status.json'
attackStatus    = {}

result = { 
    'success'   : 1,
    'errmsg'    : ""
}

def sysexit( n, errmsg="" ):
    global result
    result[ 'success' ] = 1 if n == 0 else 0
    result[ 'errmsg' ] = errmsg
    print json.dumps( result )
    sys.exit( n )
    

if not os.path.isfile( statusFilePath ):
    sysexit(1, "attack already stopped")



os.remove( statusFilePath )
""" stopFakeAP """

sysexit(0)



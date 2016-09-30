#! /usr/bin/python

import json
import StringIO
import sys
import os

from subprocess import check_output
from pprint     import pprint

station         = sys.argv[1]
bssid           = sys.argv[2]
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
    

"""  status file exist """
if os.path.isfile( statusFilePath ):
    sysexit(1, "attack already started")

""" status file not exist """
attackStatus = {
    'targetStation'   : station,
    'targetBssid'     : bssid,
    'tasks' : [
        {   'name':     "connectAP",
            'done':     0,
            'errmsg':   "" },
        {   'name':     "getSubnetInfo",
            'done':     0,
            'errmsg':   "" },
        {   'name':     "setupFakeAP",
            'done':     0,
            'errmsg':   "" },
        {   'name':     "deauthTarget",
            'done':     0,
            'errmsg':   "" }
        ] 
}
with open( statusFilePath, 'w') as fp:
    json.dump( attackStatus, fp, indent=4 )
    

""" persist AttackStatus """

""" get targetClient and targetAP information """

""" if target is online:
        connectAP
        getSubnetInfo and setFakeAPInfo """

""" setupFakeAP """
        
""" if target is online:
        deauthClient """

sysexit(0)

""" Modification History
2014-10-28 Wesley Nien
    cmdline interface with null implementation    

2014-10-29 Wesley Nien
    using json object to express attack status

"""


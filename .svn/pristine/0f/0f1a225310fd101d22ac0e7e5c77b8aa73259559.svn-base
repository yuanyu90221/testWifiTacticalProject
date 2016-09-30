#! /usr/bin/python

import json
import sys
import ConfigParser

from scapy.arch import get_if_raw_hwaddr


statusFilePath  = 'conf/FakeAPAttack.status.json'
confFilePath    = 'conf/FakeAPAttack.conf'
CONF_SECTION    = 'FakeAPAttack'

""" constants
def getStatusFilePath():
    return statusFilePath


""" config initialization
"""
config          = ConfigParser.SafeConfigParser()

# this is necessary when we want to preserve the case of item
config.optionxform = str
config.read( confFilePath )


""" environment and config
"""
def getFakeAPInterface():
    return config.get( CONF_SECTION, "FakeAPInterface" )

def getScanInterface():
    return config.get( CONF_SECTION, "ScanInterface" )

def getAttackInterface():
    return config.get( CONF_SECTION, "AttackInterface" )

def getWanInterface():
    return config.get( CONF_SECTION, "WanInterface" )

def getWpaSupplicantPid():
    with open("conf/wpa_supplicant.pid", "r") as fp:
        str = fp.readline()
        return int(str)
    raise RuntimeError("fail to get pid of wpa_supplicant")

""" 


def dumpConfig( config ):
    for section in config.sections():
#        for item in config.items( section ):
#            print section + "." + item[0] + "=" + item[1]
        for key, value in config.items( section ):
            print section + "." + key + "=" + value

def sysexit( code=0, errmsg="", **result ):
    if code == 0 and errmsg == "":
        result[ 'success' ] = 1
    else:
        result[ 'success' ] = 0
    result[ 'errmsg' ] = errmsg
    print json.dumps( result )
    sys.exit( code )

""" return normalized MAC Address string """
def mac2macStr(s):
    return ("%02X:"*6)[:-1] % tuple(map(ord, s)) 

def getHwAddr( iface ):
    addrfamily, mac = get_if_raw_hwaddr( iface )
    return mac2macStr( mac )

""" condtional operator """
#result[ 'success' ] = 1 if code == 0 else 0



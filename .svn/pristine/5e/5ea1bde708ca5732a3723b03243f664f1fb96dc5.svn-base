#! /usr/bin/python

import json
import StringIO
from subprocess import check_output
from pprint     import pprint

""" Modification History
2014-10-24 Wesley Nien
    * rename authtype to authType
    * authType now has 4 legal values:
        OPEN, WEP, WPA_PSK, WPA_Enterprize
"""

apList = [ 
{ 'bssid' : "00:23:F8:25:8F:5C", 'power' : 41, 'channel' : 1, 'authType' : "OPEN", 'essid' : "TestOpen", 'isFakeAP' : 0 } ,
{ 'bssid' : "8C:BE:BE:48:D9:81", 'power' : 21, 'channel' : 1, 'authType' : "WEP", 'essid' : "Xiaomi_JJ", 'isFakeAP' : 0 } ,
{ 'bssid' : "00:24:A5:DA:9F:A8", 'power' : 22, 'channel' : 2, 'authType' : "WPA_PSK", 'essid' : "GTISSAP", 'isFakeAP' : 0 } ,
{ 'bssid' : "00:24:A5:DA:9F:A9", 'power' : 30, 'channel' : 2, 'authType' : "WPA_Enterprize", 'essid' : "GTISS2AP", 'isFakeAP' : 0 } ,
{ 'bssid' : "aa:aa:aa:aa:aa:aa", 'power' : 80, 'channel' : 1, 'authType' : "OPEN", 'essid' : "TestOpen", 'isFakeAP' : 1 } ]

clientList = [
{ 'bssid' : "00:23:F8:25:8F:5C", 'station' : "11:11:11:11:11:11" } ,
{ 'bssid' : "00:23:F8:25:8F:5C", 'station' : "12:12:12:12:12:12" } ,
{ 'bssid' : "00:24:A5:DA:9F:A8", 'station' : "22:22:22:22:22:22" } ,
{ 'bssid' : "aa:aa:aa:aa:aa:aa", 'station' : "88:88:88:88:88:88" } ]

res = {}

dict = {}
for i in apList:
    dict[ i['bssid'] ] = i
res[ 'apDict' ]  = dict

dict = {}
for i in clientList:
    dict[ i['station'] ] = i
res[ 'clientDict' ]  = dict

#pprint( res )
#print json.dumps( res, indent=4 )
print json.dumps( res )

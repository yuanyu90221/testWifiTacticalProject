#! /usr/bin/python

"""
    * we use airodump-ng to monitor interface mon0
      to get station list and AP list
"""

import StringIO
import subprocess
import shlex
import signal
import os
import csv
import json

from subprocess import check_output
from subprocess import call
from subprocess import Popen
from pprint     import pprint
from time       import sleep


scanResultFilePath          = "conf/scanResult.json"

def getLastScanResult():
    with open( scanResultFilePath, 'r') as fp:
        return json.load( fp )

def getScanResult( iface, scanDuration=10 ):
    progName        = '/usr/sbin/airodump-ng'
    outFilePrefix   = 'scan'
    csvFileName     = outFilePrefix + "-01.csv"

    args = shlex.split(
        '{progName} -a -w {outFilePrefix} -o csv {iface}'.format(**locals()) )

    DEVNULL = open(os.devnull, 'w')

    csvDeleteCmd = 'rm {csvFileName}'.format(**locals())
    print 'cmd = ' + csvDeleteCmd
    call( shlex.split( csvDeleteCmd ) )
    proc=Popen( args, shell=None, stdout=DEVNULL, stderr=DEVNULL )
    print "process opened"

    sleep( scanDuration )
    proc.send_signal( signal.SIGINT )
    print "process interrupted"

    """ @fix:
        we need wait for process termination
        to make sure output file has been generated successfully
    """
    proc.wait()

    tables = []
    tableIndex = 0
    tables.append( [] )
    with open( csvFileName, 'r') as csvfile:
        for line in csvfile:
            #print str( len( line ) )
            if "\r\n" == line:
                #print "list boundary is found"
                if 0 < len( tables[ tableIndex ] ):
                    tables.append( [] )
                    tableIndex += 1
            else:
                tables[ tableIndex ].append( line )
    #pprint( tables )
                    
    csvReader = csv.DictReader( iter( tables[ 0 ] ), skipinitialspace=True )
    apDict = {}
    for row in csvReader:
        bssid = row[ 'BSSID' ]
        power = row[ 'Power' ]
        channel = row[ 'channel' ]
        privacy = row[ 'Privacy' ]
        authentication = row[ 'Authentication' ]
        authType = ""
        essid = row[ 'ESSID' ]
        if privacy.find( "OPN" ) != -1:
            authType = "OPEN"
        elif privacy.find( "WEP" ) != -1:
            authType = "WEP"
        elif privacy.find( "WPA" ) != -1:
            if authentication.find( "PSK" ) != -1:
                authType = "WPA_PSK"
            elif authentication.find( "MGT" ) != -1:
                authType = "WPA_Enterprize"
        
        apDict[ bssid ] = {
            'bssid' : bssid,
            'power' : int(power),
            'channel' : int(channel),
            'authType' : authType,
            'essid' : essid,
            'isFakeAP' : 0 
        }
        #pprint( row )
        

    csvReader = csv.DictReader( iter( tables[ 1 ] ), skipinitialspace=True )
    clientDict = {}
    for row in csvReader:
        bssid = row[ 'BSSID' ]
        station = row[ 'Station MAC' ]
        if bssid.find( "not associated" ) != -1:
            bssid = ""
        
        clientDict[ station ] = {
            'station' : station,
            'bssid' : bssid
        }
        #pprint( row )


    res = {
        'apDict' : apDict,
        'clientDict' : clientDict
    }
    
    # for debug and cache
    with open( scanResultFilePath, 'w') as fp:
        json.dump( res, fp, indent=4 )

    return res


""" parse CSV file """
#csvReader       = csv.DictReader(open( csvFileName ))
#for row in csvReader:
#    pprint( row )


#outs, errs = proc.communicate()
#print "hello world"

""" only for 3.3 """
#try:
#    proc.wait( 10 )
#except subprocess.TimeoutExpired:
#    print "proc.wait() timeout"



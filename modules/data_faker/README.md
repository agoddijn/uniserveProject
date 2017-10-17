This will handle creating fake data for performance testing

1. The file 'top10000.JSON' gets read into the global variable called json. 

2. You can populate the links array by calling addDataSet with this json parameter. 

3. Passing these links to generateDeviceList will return the ip address and set fake info for the devices.

4. getDevices(howMany:number) returns the first howMany devices in the links array

5. generatePingRecords(howMany: number, timeStamp: Date) generates a ping record for howMany devices


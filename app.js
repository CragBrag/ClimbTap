
/**
 * Module dependencies.
 */

var serialport = require('serialport')
  , say = require('say')
  , sys = require('sys')
  , http = require('http');

var SerialPort = serialport.SerialPort;
var serialPort = new SerialPort('/dev/cu.usbserial-A800f8Vf', {
    baudrate: 9600,
    parser: serialport.parsers.readline('0d0a03', 'hex')
});

process.on('uncaughtException', function (err) {
    console.log(err);
});

serialPort.on("open", function () {
    serialPort.on("data", function (data) {
        var buf = new Buffer(data, 'hex'),
            bufStr = buf.toString('ascii');

        bufStr = bufStr.substr(1);
        console.log(bufStr.length);

        say.speak('Alex', 'Congratulations on your climb!');
        console.log(bufStr);

        http.get('http://cragbrag.herokuapp.com/tags/' + bufStr + '/checkin', function(res) {
          console.log("Got response: " + res.statusCode);
        }).on('error', function(e) {
          console.log("Got error: " + e.message);
        });

        /*http.request({
            hostname: 'http://cragbrag.herokuapp.com',
            path: '/tags/' + bufStr + '/checkin',
            method: 'GET'
        }, function (res) {

        });*/
    });
});

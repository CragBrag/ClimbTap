/**
 * Module dependencies.
 */
var serialport = require('serialport'),
    say = require('say'),
    http = require('http');

var url = 'http://cragbrag.herokuapp.com',
    SerialPort = serialport.SerialPort,
    serialPort = new SerialPort('/dev/cu.usbserial-A800f8Vf', {
        baudrate: 9600,
        parser: serialport.parsers.readline('0d0a03', 'hex')
    });

// Prevent socket errors from blocking app.
process.on('uncaughtException', function (err) {
    console.log(err);
});

serialPort.on('open', function () {
    serialPort.on('data', function (data) {
        var buf = new Buffer(data, 'hex'),
            bufStr = buf.toString('ascii').substr(1);

        //Speak the success!
        say.speak('Alex', 'Congratulations on your climb!');
        console.log('Climber Id: ' + bufStr);

        http.get(url + '/tags/' + bufStr + '/checkin', function(res) {
            if (res.statusCode === 200) {
                console.log('Delivered successfully.');
            }
        }).on('error', function(e) {
            console.log("Got error: " + e.message);
        });
    });
});

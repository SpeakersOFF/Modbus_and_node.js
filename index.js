// create an empty modbus client

// readCoils(coil, len)
// readDiscreteInputs(addr, arg)
// readHoldingRegisters(addr, len)
// readInputRegisters(addr, len)
// writeCoil(coil, binary) //NOT setCoil
// writeRegister(addr, value)
// writeRegisters(addr, valueAry)
// readDeviceIdentification(id, obj

//     1...10000*  address - 1      Coils (outputs)    0   Read/Write
// 10001...20000*  address - 10001  Discrete Inputs    01  Read
// 30001...40000*  address - 30001  Input Registers    04  Read
// 40001...50000*  address - 40001  Holding Registers  03  Read/Write


const ModbusRTU   = require("modbus-serial");
const client      = new ModbusRTU();
const express     = require('express');
const app         = express();
const http        = require('http');
const server      = http.createServer(app);
const {Server}    = require("socket.io");
const io          = new Server(server);
var bodyParser    = require('body-parser');

var urlencodedParser = bodyParser.urlencoded({
   extended: false
})
// open connection to a tcp line
client.connectTCP("192.168.2.20");
client.setID(1);


plc_data = {
   motor_speed: 0,
   spin_rate: 0.0,
   Start: false,
   stop: true,
   running: false
}

setInterval(function () {
   client.readHoldingRegisters(0, 1, function (err, data) {
      spin = 100;
      // console.log(data.data[0]);
      plc_data.motor_speed = data.data[0]
      if (data.data[0] < 1) {
         spin = 1000;
      } else if (data.data[0] > 1 && data.data[0] <= 10) {
         spin = 100;
      } else if (data.data[0] > 10 && data.data[0] <= 20) {
         spin = 10;
      } else if (data.data[0] > 20 && data.data[0] <= 30) {
         spin = 5;
      } else if (data.data[0] > 30 && data.data[0] <= 40) {
         spin = 2.5;
      } else if (data.data[0] > 40 && data.data[0] <= 50) {
         spin = 1.25;
      } else if (data.data[0] > 50 && data.data[0] <= 75) {
         spin = 0.625;
      } else if (data.data[0] > 75 && data.data[0] <= 100) {
         spin = 0.3125;
      } 
      plc_data.spin_rate = spin;
   });
   client.readCoils(0, 5, function (err, data2) {
      //console.log(data2.data[0] + ' ' + data2.data[1] + ' ' + data2.data[2]);
      plc_data.stop = data2.data[0];
      plc_data.Start = data2.data[1];
      plc_data.running = data2.data[2];
   });

   //console.log(plc_data);
   io.sockets.emit("PLC_data", plc_data);
}, 100);


io.on('connection', (socket) => {
   socket.on("PLC_DO", (data) => {
      if (data == 'start') {
         client.writeCoil(1, true)
            .catch(function (e) {
               console.log(e.message);
            })
         client.writeCoil(1, false)
            .catch(function (e) {
               console.log(e.message);
            })
      } else if (data == 'stop') {
         client.writeCoil(0, true)
            .catch(function (e) {
               console.log(e.message);
            })
         client.writeCoil(0, false)
            .catch(function (e) {
               console.log(e.message);
            })
      }
   });
});
// Create application/x-www-form-urlencoded parser

app.use(express.static('public'));
app.get('/', function (req, res) {
   res.sendFile(__dirname + "/" + "index.html");
})

server.listen(8082, function () {
   var host = server.address().address
   var port = server.address().port
   console.log("Example app listening at http://%s:%s", host, port)
})
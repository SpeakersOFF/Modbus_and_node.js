# Modbus_and_node.js
simple example of controlling and motor PLC

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

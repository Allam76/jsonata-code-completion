const express = require('express');
var path = require('path');

const app = express();
app.use("/schemas",express.static(path.join(__dirname, './schemas')));
app.use("/",express.static(path.join(__dirname, '../')));
app.listen(1234);
console.log("server listens to 1234")
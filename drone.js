var HID = require('node-hid');
var arDrone = require('ar-drone');
var keypress = require('keypress');
var temporal = require('temporal');

var client  = arDrone.createClient();

// client.createRepl();
// var devices = HID.devices()

//console.log(devices);

// apple trackpad
var device = new HID.HID(1452, 627);
var flying = false;

// track pad controls
device.on("data", function(data) { 
  var click = data.readInt8(1, 0);
  var x = data.readInt8(2, 0);
  var y = data.readInt8(3,0);
  console.log("X: "+x+", Y: "+y+", click: "+click);
/*
  if (click && flying === false) {
    console.log("Taking off!");
    flying = true;
    client.takeoff();
  } else if (!click && flying === true) {
    console.log("Landing!");
    client.land();
    flying = false;
  }
*/

  // No movement.
  if (x === 0 && y === 0) {
    client.stop(); 
  }

  if (x < 0) {
    // trackpad left
    client.left(0.5);

  } else if (x > 0) {
    // trackpad right 
    client.right(0.5);

  }

  if (y < 0) {
    //trackpad up
    client.front(0.5);
  } else if (y > 0) {
    //trackpad down
    client.back(0.5);

  }
  //console.log(data);
});

// keyboard controls


process.stdin.resume(); 
process.stdin.setEncoding('utf8'); 
process.stdin.setRawMode(true); 
process.stdin.on('data', function(char) { 
  if (char == '\3') { 
    client.land();
    console.log('\nExiting on Ctrl-C...'); 
    process.exit(); 
  } else if (char == 'q') { 
    console.log('\nExiting on q...'); 
    process.exit(); 
  } else if (char == '\5') { 
    console.log('\nCtrl+E'); 
  } else if (char == '\14') { 
    client.land();
    console.log('\nCtrl+L'); 
  } else if (char === 'l') {
    console.log("Landing.");
    client.land();
  } else if (char === 't') {
    console.log("Taking off.");
    client.takeoff();
  } else if (char === 'w') {
    client.up(0.5);
    temporal.delay(500, function() {
      client.stop();
    });
  } else if (char === 's') {
    client.down(0.5);
    temporal.delay(500, function() {
      client.stop();
    });
  
  } else { 
    process.stdout.write(char); 
  } 
}); 
/*
keypress(process.stdin);

process.stdin('keypress', function(ch, key) {
  console.log("got keypress ", key);
  if (key.ctrl && (key.name == 'e' || key.name == 'l')) {
    client.land();
  }
  if (key.ctrl && key.name == 't') {
    client.takeoff();
  }
});
process.stdin.resume();
*/

// ======================
// CONFIGURATION
// ======================

// Get config
const config = require('./config.js');



// ======================
// APP
// ======================

// Get modules
const fs           = require('fs');
const express      = require('express');
const childProcess = require('child_process');
const bodyParser   = require('body-parser');

// Init log file
if(!fs.existsSync(config.logs)) fs.writeFileSync(config.logs, '');

// Create serveur
var app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Init status
var inupdate = false;

// Main route
app.post('/', async function(req, res)
{
	// Send receipt
	res.send(200);

	// Prevent double call
	if(inupdate) return;
	inupdate = true;

	// If branch staging push
	if(config.branch && req.body.ref.indexOf(config.branch) != -1)
	{
		log('Update branch ' + config.branch + '...');

		// Force update repo
		var e = await childProcess.exec('git fetch --all', { cwd:config.cwd }).err;
		if(e) return log('Fail !\n' + JSON.strinigfy(e)), inupdate = false;

		var e = await childProcess.exec('git reset --hard origin/' + config.branch, { cwd:config.cwd }).err;
		if(e) return log('Fail !\n' + JSON.strinigfy(e)), inupdate = false;

		log('Branch updated !');

		// Execute after js
		await (config.after||function(){})();

		log('After Success !');
	}
});

// Save log
function log(msg)
{
	fs.appendFileSync(config.logs, '\n[' + (new Date()).getDate() + '/' + ((new Date()).getMonth() + 1) + '/' + (new Date()).getFullYear() + ' ' + (new Date()).getHours() + ':' + (new Date()).getMinutes() + ':' + (new Date()).getSeconds() + '] ' + msg);
}

// Set port
app.listen(4242);




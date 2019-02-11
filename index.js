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

// Init status (prevent double call)
var inupdate;

// Main route
app.post('/', async function(req, res)
{
	// Prevent double call
	if(inupdate) return setTimeout(() => { update(req, res); }, 1000);

	// Wait update
	await update(req, res);
});

// Set application port
app.listen(4242);



// ======================
// FUNCTION
// ======================

// Update function
async function update(req,res)
{
	// Set in update
	inupdate = true;

	// Init fail
	let fail;

	// If branch push
	if(!config.branch || (req.body && req.body.ref && req.body.ref.indexOf(config.branch) != -1))
	{
		// Save log update...
		log('Update branch "' + (config.branch||'all') + '"...');

		// Fetch all
		fail = await childProcess.exec('git fetch --all', { cwd:config.cwd }).err;
		if(fail) { log('Fail !\n' + JSON.strinigfy(e)); }

		// Force reset repo
		fail = await childProcess.exec('git reset --hard origin/' + config.branch, { cwd:config.cwd }).err;
		if(fail) { log('Fail !\n' + JSON.strinigfy(e)); }

		// Prevent fail
		if(fail)
		{
			// Add log
			log('FAIL :\n' + fail);

			// Return fail
			return res.status(500).send(fail);
		}

		// Save log updated
		log('Branch updated !');

		// Execute after js
		if(!fail) await (config.after||function(){})();

		// Save log success
		log('After Success !');
	}
	else
	{
		// Add logs
		log(req.body);
	}

	// Clear in update 
	inupdate = false;

	// Send success
	res.status(200).send('SUCCESS !');
}

// Save log function
function log(msg)
{
	fs.appendFileSync(config.logs, '\n[' + (new Date()).getDate() + '/' + ((new Date()).getMonth() + 1) + '/' + (new Date()).getFullYear() + ' ' + (new Date()).getHours() + ':' + (new Date()).getMinutes() + ':' + (new Date()).getSeconds() + '] ' + msg);
}




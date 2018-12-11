// Get modules
const fs           = require('fs');
const express      = require('express');
const childProcess = require('child_process');
const bodyParser   = require('body-parser');

// Set paths
const
	branch = 'master',
	cwd    = __dirname + '/../change/this/path/',
	logs   = __dirname + '/logs.txt'
;

// Init logs
if(!fs.existsSync(logs)) fs.writeFileSync(logs, '');

// Create serveur
var app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Init status
var inupdate = false;

// Main route
app.post('/', async function(req, res)
{
	// Prevent double call
	if(inupdate) return ended();
	inupdate = true;

	// If branch staging push
	if(req.body.ref.indexOf(branch) != -1)
	{
		log('Update branch ' + branch + '...');

		// Force update repo
		var e = await childProcess.exec('git fetch --all', { cwd }).err;
		if(e) return log('Fail !\n' + JSON.strinigfy(e)), ended(e);

		var e = await childProcess.exec('git reset --hard origin/' + branch, { cwd }).err;
		if(e) return log('Fail !\n' + JSON.strinigfy(e)), ended(e);

		log('Branch updated !');
	}

	// Return ok
	ended();
});

// Function update status
function ended(erreur)
{
	// Update status
	inupdate = false;

	// Return response
	return res.send(erreur ? 500 : 200);
}

// Save log
function log(msg)
{
	fs.appendFileSync(logs, '[' + (new Date()).getDate() + '/' + ((new Date()).getMonth() + 1) + '/' + (new Date()).getFullYear() + ' ' + (new Date()).getHours() + ':' + (new Date()).getMinutes() + ':' + (new Date()).getSeconds() + '] ' + msg);
}

// Set port
app.listen(4242);




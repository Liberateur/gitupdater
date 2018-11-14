// Get modules
const express      = require('express');
const childProcess = require('child_process');
const bodyParser   = require('body-parser');

// Create serveur
var app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Set path repo
const cwd = __dirname + '/../change/this/path/';

// Main route
app.post('/', async function(req, res)
{
	// If branch staging push
	if(req.body.ref.indexOf('master') != -1)
	{
		// Force update repo
		if(await childProcess.exec('git fetch --all', { cwd }).err)                return res.send(500);
		if(await childProcess.exec('git reset --hard origin/master', { cwd }).err) return res.send(500);
		if(await childProcess.exec('git pull origin master', { cwd }).err)         return res.send(500);
	}

	// Return ok
	res.send(200);
});

// Set port
app.listen(4242);



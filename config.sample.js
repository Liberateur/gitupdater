// Get modules
const childProcess = require('child_process');

// Set config
var config = {};

// Name of the branch that triggers the update or false if all
config.branch: 'master',

// Path to the repo
config.cwd: __dirname + '/../change/this/path/',

// Log file path
config.logs: __dirname + '/logs.txt',

// Function async after execute update or false
config.after: async function()
{
	// Execute scripts
	await childProcess.exec('node scripts/datas',      { cwd:config.cwd });
	await childProcess.exec('node scripts/ressources', { cwd:config.cwd });

	// Restart all pm2
	await childProcess.exec('sudo pm2 restart all',    { cwd:config.cwd });
}

// Export
module.exports = config;



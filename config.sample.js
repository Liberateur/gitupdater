// Get modules
const childProcess = require('child_process');

// Export
module.exports =
{
	// Name of the branch that triggers the update or false if all
	branch: 'master',

	// Path to the repo
	cwd: __dirname + '/../change/this/path/',

	// Log file path
	logs: __dirname + '/logs.txt',

	// Function async after execute update or false
	after: async function()
	{
		// Restart all pm2 node
		await childProcess.exec('sudo pm2 restart all', { cwd });
	}
};



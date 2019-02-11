// Get modules
const childProcess = require('child_process');

// Export
module.exports = async function()
{
	// Execute scripts
	await childProcess.exec('node scripts/datas', { cwd });
	await childProcess.exec('node scripts/ressources', { cwd });

	// Restart express
	await childProcess.exec('sudo pm2 restart all', { cwd });
};
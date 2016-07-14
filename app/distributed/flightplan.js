// flightplan.js
var plan = require('flightplan');

// configuration
plan.target('production', [
    {
	host: 'cloudy-ga.cloudapp.net',
	username: 'azureuser',
	agent: process.env.SSH_AUTH_SOCK
    },{
	host: 'deb-cloudy-ga1029.cloudapp.net',
	username: 'cloudy',
	agent: process.env.SSH_AUTH_SOCK
    }
]);

// Local
plan.local(function(local) {
    local.echo('Plan local: push changes');
    local.exec('git push');
});

// run commands on the target's remote hosts
plan.remote(function(remote) {
    remote.log('Pull');
    remote.with('cd cloudy-ga',function() {
	remote.exec('git pull');
	remote.exec('cd app/distributed; npm install .');
    });
    // Camino completo por sudo
    remote.with('cd cloudy-ga/app/distributed',function() {
	remote.exec('npm start');
    });
});

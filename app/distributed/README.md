#Cloudy tools for running an evolutionary algorithm

Running an evolutionary algorithm in the cloud. This one mainly
intended for distributed running


Install dependencies with

	npm i
	
and run

	./distributed-ea-HIFF.js

for an evolutioanry algorithm running the Hierarchical If and Only If
function. It probably won't find the solution. Tweak `config.js` to
try and find the correct population size, or maybe use smaller
chromosomes.

You can use several logging services. If you use
[PaperTrail](https://papertrailapp.com/), which you probably should,
set the environment variables `PAPERTRAIL_PORT` and `PAPERTRAIL_HOST`
to the values given by the application, and run it.

You can also use Logstash, in which case you will have to set the
variables `LOGSTASH_PORT` and `LOGSTASH_IP` to their correct
values. With docker, you can set up a local service by running

	./docker-logstash.sh

and then assigning

	export LOGSTASH_PORT=8080
	export LOGSTASH_IP=172.17.0.2

or whatever default value you have assigned by default.

	

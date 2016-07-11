#!/bin/bash

sudo docker run -e "PAPERTRAIL_PORT=$PAPERTRAIL_PORT" -e "PAPERTRAIL_HOST=$PAPERTRAIL_HOST" -t jjmerelo/cloudy-ga:0.0.1 bash -c "./async-ea-HIFF.js"

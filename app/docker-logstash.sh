#!/bin/bash

sudo docker run -it --rm logstash logstash -e 'input { tcp { port=> 8080 type=>"sample"} } output { stdout { } }'

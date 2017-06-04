# Set up using base node
FROM node 
MAINTAINER JJ Merelo "jjmerelo@gmail.com"
RUN echo "Building a docker environment for NodEO"
ENV DEBIAN_FRONTEND=noninteractive

#Download basic stuff
RUN apt-get update && apt-get upgrade -y
RUN apt-get install apt-utils nodejs npm -y 
RUN ln -s /usr/bin/nodejs /usr/bin/node
#And check installed version
RUN node --version

#Set up app
RUN mkdir app
ADD https://github.com/JJ/cloudy-ga/raw/master/app/callback-ea-HIFF.js app
ADD https://github.com/JJ/cloudy-ga/raw/master/app/package.json app
ADD https://github.com/JJ/cloudy-ga/raw/master/app/hiff.json app
WORKDIR /app

#Install needed libraries and make executable
RUN npm i
RUN chmod +x callback-ea-HIFF.js
RUN cat package.json

#Set up running cmd
CMD npm start

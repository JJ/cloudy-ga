# Set up using base node
FROM node:alpine 
RUN echo "Building a docker environment for NodEO"
ENV DEBIAN_FRONTEND=noninteractive
LABEL version="0.0.2" maintainer="JJ Merelo <jjmerelo@gmail.com>"


#Download basic stuff
RUN apk update && apk upgrade && apk add python make g++ 
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
RUN apk del make g++ python

#Set up running cmd
CMD npm start

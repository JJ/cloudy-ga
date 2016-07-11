FROM phusion/baseimage
MAINTAINER JJ Merelo "jjmerelo@gmail.com"
RUN echo "Building a docker environment for NodEO"
ENV DEBIAN_FRONTEND=noninteractive
RUN apt-get update && apt-get upgrade -y
RUN apt-get install apt-utils -y 
RUN apt-get install nodejs npm -y 
RUN ln -s /usr/bin/nodejs /usr/bin/node
RUN node --version
RUN mkdir app
ADD https://github.com/JJ/cloudy-ga/raw/master/app/async-ea-HIFF.js app
ADD https://github.com/JJ/cloudy-ga/raw/master/app/package.json app
ADD https://github.com/JJ/cloudy-ga/raw/master/app/hiff.json app
WORKDIR /app
RUN npm i
RUN chmod +x async-ea-HIFF.js
CMD npm start
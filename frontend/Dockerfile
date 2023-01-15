FROM node:14

RUN apt-get update  && apt-get install dos2unix
WORKDIR /usr/src/
COPY . . 
RUN npm install
RUN dos2unix docker-entrypoint.sh
EXPOSE 8070
RUN ls 
ENTRYPOINT ["./docker-entrypoint.sh"]


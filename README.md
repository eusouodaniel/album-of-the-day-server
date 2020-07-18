# Album of the day - Backend

## How to run
- Using mongo with docker container: **docker-compose up -d**
- Install libraries **npm install or yarn**
- Run project **npm start or yarn start - using hot loader(nodemon)**
- Run project with **Docker**:<br>
		
		docker image build -t album-of-the-day .
		docker container run -p 3001:3001 --detach --name album-server album-of-the-day
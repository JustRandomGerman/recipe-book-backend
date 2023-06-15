# recipe-book-backend
the backend for the recipe-book app

## Installation

### Requirements
Needed packages:
- nodejs
- mysql (when not using the test docker)
- docker-compose (when using the test docker)

Install all other dependencies:
```
npm install
```

### Setting up the database (with the test docker)
Change to the docker directory and start the container:
```
cd test_docker
docker-compose -f recipe-book-test-docker-compose.yml up
```
Copy the test images to the correct directory
```
cp test_images/* ../public/images
```
The settings in the example data source are already set for the test docker, so you just need to copy it:
```
cd ../src
cp data-source.ts.example data-source.ts
```

### Setting up the database (when using manual installation)
Create a new database and user and grant privileges on the database to the user:
```
create database <DATABASE_NAME>;
create user '<USERNAME>'@'localhost' identified by '<PASSWORD>';
grant all privileges on <DATABASE_NAME>.* to '<USERNAME>'@'localhost';
```
Configuring settings for the database
```
cp data-source.ts.example data-source.ts
```
And then set username, password and database in data-source.ts

### Start the backend
In the root directory run:
```
npm start
```
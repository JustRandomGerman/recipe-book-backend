# recipe-book-backend
the backend for the recipe-book app

## Installation

### Requirements
Needed packages:
- nodejs
- mysql

Install all other dependencies:
```
npm install
```

### Database
Create a new database and user and grant privileges on the database to the user:
```
create database <DATABASE_NAME>;
create user '<USERNAME>'@'localhost' identified by '<PASSWORD>';
grant all privileges on <DATABASE_NAME>.* to '<USERNAME>'@'localhost';
```
Create the config file for typeorm
```
cp ormconfig.json.example ormconfig.json
```
And then set username, password and database in ormconfig.json
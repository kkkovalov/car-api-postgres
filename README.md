Basic Car API project to display knowledge and use of Node.JS, Express and Postgres tools.

* Cars API by Vladyslav Kovalov
This project has been created to demonstrate knowledge of SQL language when interacting with PostgresSQL database, setting up Node.JS(Express) app to varying endpoints.

Default server is running on http://localhost:3000/. To alter HOSTNAME or PORT, go to index.js file in main directory.

** How to use Cars API:
All request assume you always start with an endpoint of http://localhost:3000/;

> GET /cars
Request will return all available data on cars in JSON object.


> DELETE /cars/:id 
***Deletes item with id specified in request from the table cars.
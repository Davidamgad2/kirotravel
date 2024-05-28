# Kiro_test


Backend APIs for Movies library.<br />
1. clone the project. <br />
2. install NodeJS on your machine.<br />
3. run `npm i`. <br />
4. add config.env ex: PORT=3000
LOCAL_DB_STR=mongodb://localhost:27017/fepDB 
ADMINNAME=Menia<br/>
4. unComment addMovies function in ".config/DBconnection.js" to instert data (don't forget to comment it back).
5. run  `npm start`.<br />

## APIs: 
- movies:
    - POST:   http://localhost:3000/movies/             for creating a new movie<br />
    - GET:   http://localhost:3030/movies/              for fetching all movies in the database <br />
    - GET:   http://localhost:3030/movies/genre          to get Movies with every genre (your task is here check controller )<br />
    - patch:   http://localhost:3030/movies/movie/id    for updating a movie with id <br />
    - DELETE: http://localhost:3030/movies/movie/id     for deleting a movie with id <br />
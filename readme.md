### configs
#### .env

PORT:           port number from server
<br>
POSTGRES_URI:   postgres uri connection

### migrations
to create tables on database execute

    yarn migrate

### restore database
to drop tables on database execute

    yarn clear

### start server
to start server execute

    yarn start     // production command
    yarn dev       // to reload server on changes
# Multiplayer_tic_tac_toe

# Install Dependencies

**For Server** - `cd server` `npm i`

**For Client** - `cd client` ` npm i`

## Env Variables

Make Sure to Create a config.env file in client/.env and server/.env directory and add appropriate variables in order to use the app.

**Essential Variables**
For Client side:
REACT_APP_SOCKET_SERVER_URL="http://localhost:5000"

For Server Side:
CONNECTION_URL=
SECRET_HASH=
FRONT_URL='http://localhost:3000'

_fill each filed with your info respectively_

# A logical explanation of architectural choices in the project:

MongoDB: I have used MongoDB as the database to store the data related to the users such as login, registration details and game history of the user.

ExpressJS: I have used ExpressJS to create RESTful APIs to handle the data flow between the front-end and the back-end.

Socket.io: I have used socket.io for real-time communication between the players in the game.

NodeJS: I have used NodeJS as the runtime environment for your server-side code. 

React: I have used React for building the user interface of your game. 

Redux: I have used Redux for state management.

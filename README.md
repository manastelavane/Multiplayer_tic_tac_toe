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

## MongoDB: 
I have used MongoDB as the database to store the data related to the users such as login, registration details and game history of the user.

## ExpressJS:
I have used ExpressJS to create RESTful APIs to handle the data flow between the front-end and the back-end.

## Socket.io:
I have used socket.io for real-time communication between the players in the game.

## NodeJS:
I have used NodeJS as the runtime environment for your server-side code. 

## React: 
I have used React for building the user interface of your game. 

## Redux:
I have used Redux for state management.

# Assumptions:

User will provide a valid email Id.

# Problem Faced:
During the development of the multiplayer Tic Tac Toe game using the MERN stack, I faced several challenges. 

One of the biggest challenges I faced was in the design and database aspect of the project. Designing the database to store information about the users, game rooms, and game history was a complex task.

Another challenge was implementing real-time communication using socket.io. Ensuring that the game was responsive and could be played by multiple players simultaneously required a significant amount of testing and optimization.

One more challenge was state management, as the state of the game needed to be updated in real-time for all players.

To overcome these challenges, I utilised various techniques and tools such as using a library for state management, and testing the game on different devices.
Documenting these problems helped me to understand the challenges and come up with solutions that worked for me.

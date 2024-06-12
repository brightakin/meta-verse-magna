# Metaverse Magna Backend

## Setup

1. Clone the repository
2. Create a `.env` file with the necessary environment variables
3. Run `docker-compose up --build`
4. The app will be available at `http://localhost:4000`
5. To run without docker run npm install then npm start

## Endpoints

- `POST /register` - Register a new user
- `POST /login` - Login and receive a JWT token

## Socket.io

Connect to the Socket.io server at `http://localhost:4001`

- Authenticate with the JWT token
- Subscribe to events with types: `all`, `sender`, `receiver`, `both`
- Run command node test.js in the root directory to test the application

## Test

- Setup and run the application with the above instructions
- Open another terminal window
- Run the command node test.js in the route directory

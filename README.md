# Metaverse Magna Backend

## Setup

1. Clone the repository
2. Create a `.env` file with the necessary environment variables
3. Run `docker-compose up --build`
4. The app will be available at `http://localhost:4000`

## Endpoints

- `POST /register` - Register a new user
- `POST /login` - Login and receive a JWT token

## Socket.io

Connect to the Socket.io server at `http://localhost:4001`

- Authenticate with the JWT token
- Subscribe to events with types: `all`, `sender`, `receiver`, `both`
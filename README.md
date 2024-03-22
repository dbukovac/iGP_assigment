When you're ready, start your application by running:
`docker compose up --build`.

Your application will be available at http://localhost:5000.
Socket for listening to messages will be available at http://localhost:5005.

Create a user with POST http://localhost:5000/api/auth/register by sending 
{
    "name": "netko1",
    "email": "netko1@gmail.com",
    "password": "pass"
}

Login with POST http://localhost:5000/api/auth/login by sending
{
    "email": "netko1@gmail.com",
    "password": "pass"
}

Send message with http://localhost:5000/api/messaging/sendMessage by sending
{
    "message": "poruke"
}

Connect to socket to receive messages by configuring Postman for a websocket connection using ws://localhost:5005
and setting the header "Authorization" to the value of the cookie "token" received from the login request
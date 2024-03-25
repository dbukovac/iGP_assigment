When you're ready, start your application by running:
`docker compose up --build`.

Your application will be available at http://localhost:5002.
Socket for listening to messages will be available at http://localhost:5005.

Create a user with POST http://localhost:5002/api/auth/register by sending 
{
    "name": "netko1",
    "email": "netko1@gmail.com",
    "password": "pass"
}

Login with POST http://localhost:5002/api/auth/login by sending
{
    "email": "netko1@gmail.com",
    "password": "pass"
}

Send a message to a specific user with http://localhost:5002/api/messaging/sendMessage by sending
{
    "message": "poruke",
    "email": "netko1@gmail.com"
}

Send a message to all users with http://localhost:5002/api/messaging/sendMessage by sending
{
    "message": "poruke"
}

Connect to socket to receive messages by configuring Postman for a websocket connection using ws://localhost:5005
and setting the header "Authorization" to the value of the cookie "token" received from the login request

Registration and login
Users and their data is held in a MongoDB database as I had experience with that as was the easiest to configure, the app would work the same and there would not be much more work to adapt the app to use a SQL database.
During login I used JWT that is returned to the "logged in" user so he can connect to the websocket to listen to notifications. JWT was the first technology that I remebered I could use to authenticate the user to the app. There are other alternatives as OAuth2 but since it is a simple backend app this shold be ok.
The email sending is mocked, no email is sent, but I used redis and BullMQ to create a queue that would process email send requests to ensure that emails would be sent even if there lots of requests at the same time. I chose BullMQ because I used it before, I could have used RabbitMQ. Kafka is also an option but I think it is to complicated to run it just for one queue.
Notifications
Notifications are sent to the user via web sockets, user first needs to connect to a web socket by providing his JWT token and when connected, he can listen to messages intended for him or broadcasted to everyone. I imagined the user as a frontend application that would need to receive notification anytime the backend creates them, so the logical idea was to use web sockets. I used WebSocketServer but there as other alternatives for Node.js that work almost the same, this was the simplest.
Messages get to the web socket by consuming them from Kafka using one consumer. Consumer then knows by email which user to send the message to, or if the email is missing it then distributes the messsage to all listeners. Kafka was not really necessary in the case to just send messages to the frontend app, but I used it to imitate a bigger system where the producer of the messages is another app that is processing some other data which is then used to create notifications. This app allows the user to produce its own messages with a API call to make it easier top test and to show that I know to user the whole producer to consumer Kafka workflow.
This application can be run with npm start, but then the user would need to separately install and configure Redis, mongoDB and Kafka, so I put everything the app needs to run in a Docker container.

Some considerations:
Route /messaging/sendMessage is not protected, if it was offered as a legitimate route it would also need to have the user to be authorized.
I could have made a Kafka consumer for every user that logged in and then produce messages only for that consumer, but I think this would have used more resources than necessary for the level of complexity of the app.
Sending emails was mocked as it requires to have a email sending service to connect to.
I used Swagger to document the applications endpoints, it is really easy to use and if configured right could also be used to test the endpoints. With this app it is usefull and not usefull at the same time, because to use the web socket to receive messages you need to use Postman.
Morgan logger is used for HTTP request logging and Winston logger is user for console logs and logs to files.
Node config is used to hold app config data, as opposed to holding the data in the environment variables.
Login request returns the JWT token also in the response body because when using Swagger you cannot configure it to see the cookie of the response. This way you can still use Swagger to get the token to use the web socket. For a real application I would not return the token in the response body.
I did not write tests for this app but if I did I would first test the Auth endpoints. I would need to mock MongoDB to test the registration and login. I could test the Redis queue to see if it reads the emails it needs to send correctly from the queue after registration. I would test Kafka by mocking a consumer that would listen to messages produced by the sendMessage API call to confirm the API and Kafka is passing messages correctly. 
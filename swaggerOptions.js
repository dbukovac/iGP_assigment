const options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'iGP Assignment',
            version: '1.0.0',
            description: 'App that allows registration and login of users and sending messages to logged in users built on Node.js API',
        },
        servers: [
            {url:'http://localhost:5000/api/'},
        ],
    },
    apis: ['./routes/*.js'], //you can change you swagger path
};

module.exports = options;
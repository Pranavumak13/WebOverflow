# Getting Started

• ­Download and install the latest version of [Nodejs](https://nodejs.org/en/download/)\
• `npm install` to install all the required dependencies

Declare the value of the port in environment variables, `PORT = 'your_port'`.\
• Run the command to start the server `node app.js`

The app will run in development mode on stated `PORT`\
eg: if the env variable `PORT = 4444`\
Open http://localhost:4444 in your browser

• Every time you make some changes, run the command `node app.js`

Or you can install nodemon as development dependency\
• `npm install nodemon --save-dev`\
• Run the app in development mode `nodemon app.js`

Using nodemon, the server will automatically restart on every change.
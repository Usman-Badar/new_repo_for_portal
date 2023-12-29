const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const app = express();
const fileUpload = require('express-fileupload');
const cors = require('cors');
const compression = require('compression');
const { server_file_logger, file_logger } = require('./utils/logger');
require('dotenv').config();
const port = process.env.SERVER_PORT || 8080;

process.on('unhandledRejection', function(err) {
    file_logger.error(err.stack ? err.stack : err, {label: 'unhandledRejection'})
})
process.on('uncaughtException', function(err) {
    file_logger.info(err.stack, {label: 'uncaughtException'})
})

const http = require('http');
const https = require('https');

// const sslServer = https.createServer(
//     {
//         key: fs.readFileSync('client/SSL/key.pem'),
//         cert: fs.readFileSync('client/SSL/cert.pem')
//     },
//     app
// )
const sslServer = http.createServer(app);

// CREATE SOCKET
const io = require('socket.io')( sslServer, {cors: 
    {
        origin: "*",
        methods: ['GET','POST']
    }
});

module.exports = io;

// different express packages other things
app.use(bodyParser.json({limit: "50mb"}));
app.use(bodyParser.urlencoded({limit: "50mb", extended: true, parameterLimit:50000}));
app.use( cors() );
app.use( express.json() );
app.use((req, res, next) => {
    setTimeout(() => next(), 1000);
});

app.use("/client", express.static(__dirname + "/client"));
app.use("/assets", express.static(__dirname + "/assets"));
app.use( express.static( path.join( __dirname, 'client' ) ) );

app.set('views', path.join(__dirname, 'views'));
app.set('view engine','ejs');
app.engine('html', require('ejs').renderFile);

app.use( fileUpload() );
app.use( compression() );

http.globalAgent.maxSockets = Infinity;
https.globalAgent.maxSockets = Infinity;

// app.get('/', function ( req, res ) {
//     res.sendFile( path.join( __dirname, 'client', 'index.html' ) );
// })

app.get('/signature/index/:id', function (req, res) {
    res.render('index.html');
});
app.get('/signature/match/:id', function (req, res) {
    res.render('match.html');
});
app.get('/signature/approve/:id', function (req, res) {
    res.render('approve.html');
});
app.get('/testing', function ( req, res ) {
    res.send('success');
})

// INCLUDING ALL FILES HERE
app.use( require('./include') );

sslServer.listen(port, () => {
    server_file_logger.info(`listening on port: ${port}`, {label: 'server restarted'});
})
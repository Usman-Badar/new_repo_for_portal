const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const app = express();
const fileUpload = require('express-fileupload');
const cors = require('cors');
const compression = require('compression')
const fs = require('fs');

const d = new Date();

process.on('uncaughtException', function (err) {

    fs.appendFile(
        'logs/log_' + d.toISOString().substring(0,10) + '.txt',
        d.toTimeString() + '\n' +
        'type: error' + '\n' +
        err.stack.toString() + '\n' +
        '\n',
        'utf-8',
        ( err ) => {

            if ( err )
            {
                console.error(
                    err
                );
            }

        }
    )

});

const http = require('http');
const https = require('https');

// const sslserver = https.createServer(
//     {
//         key: fs.readFileSync('client/SSL/key.pem'),
//         cert: fs.readFileSync('client/SSL/cert.pem')
//     },
//     app
// )
const sslserver = http.createServer(app);

// CREATE SOCKET
const io = require('socket.io')( sslserver,
    {
        cors: {
            origin: "*",
            methods: ['GET','POST']
        }
    }
);

module.exports = io;

// different express packages other things
app.use(bodyParser.json({limit: "50mb"}));
app.use(bodyParser.urlencoded({limit: "50mb", extended: true, parameterLimit:50000}));
app.use( cors() );
app.use( express.json() );

// simulate delay response
app.use((req, res, next) => {
    setTimeout(() => next(), 1000);
});

app.use("/client", express.static(__dirname + "/client"));
app.use("/assets", express.static(__dirname + "/assets"));
app.use( express.static( path.join( __dirname, 'client' ) ) );

app.set('views', path.join(__dirname, 'views'));
// Set EJS View Engine**
app.set('view engine','ejs');
// Set HTML engine**
app.engine('html', require('ejs').renderFile);

app.use( fileUpload() );
app.use( compression() );
require('dotenv').config();

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

sslserver.listen(process.env.SERVER_PORT, () => {
    require('dns').lookup(require('os').hostname(), function (err, add, fam) {
        const tbl = [
            {
                server: "PORTAL",
                status: "RUNNING",
                host: add,
                port: process.env.SERVER_PORT,
                process_id: process.pid
            }
        ]
        console.table(tbl);
        console.log('\n');
        console.log( `Please open URL: ${add}:${process.env.SERVER_PORT} in the browser.` );
    })
});
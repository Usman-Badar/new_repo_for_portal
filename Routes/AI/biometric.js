const express = require('express');
const router = express.Router();
const fs = require('fs');
const io = require('../../server');

io.on('connection', ( socket ) => {
    socket.on('biometric_verification_match_ac', (data) => {
        const { template, emp_id } = data;
        const fingerprint2Name = `${emp_id}---${socket.id}.bmp`;
        console.log(fingerprint2Name)
        fs.writeFile(`assets/portal/assets/${fingerprint2Name}`, template, 'base64', function () {
            io.emit('biometric_verification_match_ac', {
                id: socket.id,
                message: 'success'
            });
        });
    });
    socket.on('biometric_verification_match', (data) => {
        const { template, emp_id } = data;
        const fingerprint2Name = `${emp_id}---${socket.id}.bmp`;
        console.log(fingerprint2Name)
        fs.writeFile(`assets/portal/assets/${fingerprint2Name}`, template, 'base64', function () {
            io.emit('biometric_verification_match', {
                id: socket.id,
                message: 'success'
            });
        });
    });
    socket.on('biometric_verification_save', (data) => {
        const { template, emp_id } = data;
    
        const fingerprint2Name = `${emp_id}_${new Date().getTime()}.bmp`;
        fs.mkdir(`assets/portal/assets/biometric/${emp_id}`, { recursive: true }, () => {
            fs.writeFile(`assets/portal/assets/biometric/${emp_id}/${fingerprint2Name}`, template, 'base64', function () {
                io.emit('biometric_verification_save', {
                    id: socket.id,
                    message: 'success'
                });
            });
        });
    });
});

router.post('/biometric/match/results', ( req, res ) => {
    const { file, score, socket_id } = req.body;
    const _io = req.app.get('socketio');

    _io.to(socket_id).emit('biometric_verification_result', file == 'None' || score == '0' ? "Could not identify the employee!!" : "Matched!!");
    res.send('success');
    res.end();
} );

module.exports = router;
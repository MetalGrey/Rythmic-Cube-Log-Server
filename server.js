const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');

const app = express();
const port = 3000;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.post('/logs', (req, res) => {
    const logMessage = req.body.log;
    if (logMessage) {
        const logFilePath = path.join(__dirname, 'logs.txt');
        fs.appendFile(logFilePath, logMessage + '\n', (err) => {
            if (err) {
                console.error('Error writing to log file:', err);
                return res.status(500).send('Error writing to log file');
            }
            res.send('Log received');
        });
    } else {
        res.status(400).send('No log message provided');
    }
});

app.listen(port, () => {
    console.log(`Log server listening at http://localhost:${port}`);
});

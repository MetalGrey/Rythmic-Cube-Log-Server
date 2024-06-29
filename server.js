const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');
const https = require('https');

const app = express();
const port = 3000;

// Middleware для обработки данных из форм и JSON
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Обработчик маршрута для сохранения логов
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

// Обработчик маршрута для выдачи файла из .well-known/pki-validation
app.get('/.well-known/pki-validation/.txt', (req, res) => {
    const filePath = path.join(__dirname, '..', '..', '.txt');
    res.sendFile(filePath);
});

// Создание HTTPS сервера с помощью SSL сертификата и ключа
const httpsOptions = {
    key: fs.readFileSync('Rythmic-Cube-Log-Server/private.key'),
    cert: fs.readFileSync('Rythmic-Cube-Log-Server/certificate.crt'),
    ca: fs.readFileSync('Rythmic-Cube-Log-Server/ca_bundle.crt')
};

const httpsServer = https.createServer(httpsOptions, app);

// Запуск HTTPS сервера
httpsServer.listen(port, () => {
    console.log(`Server listening at https://localhost:${port}`);
});



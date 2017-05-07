const express = require('express');
const path = require('path');

const app = express();
const historyAPIFallback = require('connect-history-api-fallback');

import { handler } from './api/snapshot_handler';

app.use('/tests', handler);
app.use(historyAPIFallback());

// app.get('/', function (req, res) {
//     res.sendFile(__dirname + '/louis.html');
// });

export function start(luisPath = `dist/luis/`) {
    app.use(express.static(path.resolve(luisPath)));
    app.listen(9001, function () {
        console.log('Example app listening to you on port 9001!');
    });
}

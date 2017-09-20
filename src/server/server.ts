const express = require('express');
const path = require('path');
const fs = require('fs');

const app = express();
const historyAPIFallback = require('connect-history-api-fallback');

app.use(historyAPIFallback());

export function start(luisPath = `public/`) {
    try {
        fs.statSync(path.join(path.resolve(luisPath), 'luis.html'));

        app.use(express.static(path.resolve(luisPath), { index: false }));
        app.use((req: any, res: any) => res.sendFile(`${path.resolve(luisPath)}/luis.html`));
        
        app.listen(9001, function () {
            console.log('LUIS is listening to you on port 9001!');
        });
    } catch (ex) {
        console.error("ERROR!: You need to have 'luis.html' in your static directory")
    }
}

import express from 'express';
import { Server } from 'socket.io';

const port = 3000;
const app = express();

app.use(express.static('public'));

const expressServer = app.listen(port, () => {
    console.log(`App listening on port ${port}`);
});

app.get('/', (req, res) => {
    res.send('chat-app');
});

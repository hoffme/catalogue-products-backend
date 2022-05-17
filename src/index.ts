import { connect as connectMongoose } from "mongoose";
import { createServer } from "http";
import { Server } from "socket.io";
import express from "express";
import cors from 'cors';
import bodyParser from "body-parser";

import apiRouter from "./api/rest";
import setupRealtime from "./api/realtime";

import config from "./config";

const main = async () => {
    await connectMongoose(config.mongo_uri);

    const app = express();
    const httpServer = createServer(app);
    const io = new Server(httpServer);

    app.use(cors());

    app.use(bodyParser.urlencoded({ extended: false }))
    app.use(bodyParser.json())

    app.use('/api', apiRouter);
    app.use(express.static(__dirname + '/public'));

    setupRealtime(io);

    httpServer.listen(config.port, () => {
        console.log(`running on http://localhost:${config.port}`)
    })
}

main()
    .catch(console.error)
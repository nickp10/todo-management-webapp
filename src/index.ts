#! /usr/bin/env node

import * as args from "./args";
import * as bodyParser from "body-parser";
import * as crypto from "crypto-js";
import { DBSchema } from "./interfaces";
import * as express from "express";
import expressVue = require("express-vue");
import * as FileAsync from "lowdb/adapters/FileAsync";
import login from "./routes/login";
import * as lowdb from "lowdb";
import * as path from "path";
import * as uuid4 from "uuid/v4";

const vueOptions = {
    rootPath: path.join(__dirname, "routes"),
    vue: {
        head: {
            meta: [{
                script: "assets/js/jquery.min.js"
            },
            {
                script: "assets/js/popper.min.js"
            },
            {
                script: "assets/js/vue.min.js"
            },
            {
                script: "assets/js/bootstrap.min.js"
            },
            {
                style: "assets/css/bootstrap.min.css"
            },
            {
                style: "assets/css/bootstrap.reboot.min.css"
            },
            {
                name: "viewport",
                value: "width=device-width, initial-scale=1, shrink-to-fit=no"
            }]
        }
    }
};
const dbAdapter = new FileAsync<DBSchema>(args.dbPath);
lowdb(dbAdapter).then((db) => {
    const defaults: DBSchema = {
        users: [
            {
                id: uuid4(),
                username: "admin",
                password: crypto.SHA256("admin").toString(),
                isAdmin: true,
                maxTasks: 100
            }
        ],
        tasks: [],
        customFields: []
    };
    db.defaults(defaults).write();
    const app = express();
    app.use(bodyParser.urlencoded({ extended: true }));
    app.use((<any>expressVue).init(vueOptions));
    app.use("/assets", express.static(path.join(__dirname, "assets")));
    login(app, db);
    app.listen(args.port, () => {
        console.log(`Server has started on port ${args.port}.`);
    });
});

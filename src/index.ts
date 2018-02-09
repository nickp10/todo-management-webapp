#! /usr/bin/env node

import * as args from "./args";
import * as bodyParser from "body-parser";
import * as crypto from "crypto-js";
import { DBSchema } from "./interfaces";
import * as express from "express";
import * as expressSession from "express-session";
import expressVue = require("express-vue");
import * as FileAsync from "lowdb/adapters/FileAsync";
import * as lowdb from "lowdb";
import * as path from "path";
import * as uuid4 from "uuid/v4";
import { completeGet } from "./routes/complete";
import { homeGet } from "./routes/home";
import { loginGet, loginPost } from "./routes/login";
import { logoutGet } from "./routes/logout";
import { saveNotesPost } from "./routes/saveNotes";
import { startGet } from "./routes/start";
const MemoryStore = require("memorystore")(expressSession);

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
                style: "assets/css/bootstrap-grid.min.css"
            },
            {
                style: "assets/css/bootstrap-reboot.min.css"
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
    const id= uuid4();
    const defaults: DBSchema = {
        users: [
            {
                id: id,
                username: "admin",
                password: crypto.SHA256("admin").toString(),
                isAdmin: true,
                maxTasks: 100
            }
        ],
        tasks: [
            {
                id: uuid4(),
                title: "First Task",
                deadline: new Date(),
                description: "Description for the first task to accomplish",
                assignee: id,
                status: "Not Started",
                notes: "These are some awesome notes"
            },
            {
                id: uuid4(),
                title: "Second Task",
                description: "Description for the second task to accomplish",
                assignee: id,
                status: "Not Started"
            }
        ],
        customFields: []
    };
    db.defaults(defaults).write();
    const app = express();
    app.use(expressSession({
        store: new MemoryStore({
            checkPeriod: 86400000 // 24 hours
        }),
        secret: "todo-management-webapp",
        resave: false,
        saveUninitialized: false
    }));
    app.use(bodyParser.urlencoded({ extended: true }));
    app.use((<any>expressVue).init(vueOptions));
    app.use("/assets", express.static(path.join(__dirname, "assets")));
    app.get("/", (req, res) => loginGet(req, res, db));
    app.post("/", (req, res) => loginPost(req, res, db));
    app.get("/home", (req, res) => homeGet(req, res, db));
    app.get("/logout", (req, res) => logoutGet(req, res, db));
    app.get("/start", (req, res) => startGet(req, res, db));
    app.get("/complete", (req, res) => completeGet(req, res, db));
    app.post("/saveNotes", (req, res) => saveNotesPost(req, res, db));
    app.listen(args.port, () => {
        console.log(`Server has started on port ${args.port}.`);
    });
});

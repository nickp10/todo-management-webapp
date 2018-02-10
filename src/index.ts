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
import { adminCustomFieldsGet, adminCustomFieldsPost, adminCustomFieldsDelete } from "./routes/admin/customFields";
import { adminTasksEditGet, adminTasksEditPost } from "./routes/admin/editTask";
import { adminTasksGet, adminTasksDelete } from "./routes/admin/tasks";
import { adminUsersEditGet, adminUsersEditPost } from "./routes/admin/editUser";
import { adminUsersGet, adminUsersDelete } from "./routes/admin/users";
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
                script: "/assets/js/jquery.min.js"
            },
            {
                script: "/assets/js/moment.min.js"
            },
            {
                script: "/assets/js/popper.min.js"
            },
            {
                script: "/assets/js/vue.min.js"
            },
            {
                script: "/assets/js/bootstrap.min.js"
            },
            {
                script: "/assets/js/tempusdominus-bootstrap-4.min.js"
            },
            {
                style: "/assets/css/bootstrap.min.css"
            },
            {
                style: "/assets/css/bootstrap-grid.min.css"
            },
            {
                style: "/assets/css/bootstrap-reboot.min.css"
            },
            {
                style: "/assets/css/font-awesome.min.css"
            },
            {
                style: "/assets/css/tempusdominus-bootstrap-4.min.css"
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
                isRoot: true,
                maxTasks: 100
            },
            {
                id: uuid4(),
                username: "train1",
                password: crypto.SHA256("train1").toString(),
                isAdmin: true,
                isRoot: false,
                maxTasks: 100
            },
            {
                id: uuid4(),
                username: "train2",
                password: crypto.SHA256("train2").toString(),
                isAdmin: false,
                isRoot: false,
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
            },
            {
                id: uuid4(),
                title: "Third Task",
                deadline: new Date(),
                description: "Description for the third task to accomplish",
                assignee: id,
                status: "Completed",
                notes: "These are some awesome notes"
            },
            {
                id: uuid4(),
                title: "Fourth Task",
                description: "Description for the fourth task to accomplish",
                assignee: id,
                status: "Not Started"
            },
            {
                id: uuid4(),
                title: "Fifth Task",
                description: "Description for the fith task to accomplish",
                status: "Started"
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
    app.get("/admin/tasks", (req, res) => adminTasksGet(req, res, db));
    app.get("/admin/customFields", (req, res) => adminCustomFieldsGet(req, res, db));
    app.post("/admin/customFields", (req, res) => adminCustomFieldsPost(req, res, db));
    app.get("/admin/customFields/delete", (req, res) => adminCustomFieldsDelete(req, res, db));
    app.get("/admin/tasks/delete", (req, res) => adminTasksDelete(req, res, db));
    app.get("/admin/tasks/edit", (req, res) => adminTasksEditGet(req, res, db));
    app.post("/admin/tasks/edit", (req, res) => adminTasksEditPost(req, res, db));
    app.get("/admin/users", (req, res) => adminUsersGet(req, res, db));
    app.get("/admin/users/delete", (req, res) => adminUsersDelete(req, res, db));
    app.get("/admin/users/edit", (req, res) => adminUsersEditGet(req, res, db));
    app.post("/admin/users/edit", (req, res) => adminUsersEditPost(req, res, db));
    app.listen(args.port, () => {
        console.log(`Server has started on port ${args.port}.`);
    });
});

#! /usr/bin/env node

import * as args from "./args";
import * as bodyParser from "body-parser";
import * as crypto from "crypto-js";
import { DBSchema } from "./interfaces";
import * as express from "express";
import * as expressFileUpload from "express-fileupload";
import * as expressSession from "express-session";
import expressVue = require("express-vue");
import * as FileAsync from "lowdb/adapters/FileAsync";
import * as fs from "fs";
import * as lowdb from "lowdb";
import * as path from "path";
import * as process from "process";
import { v4 as uuid4 } from "uuid";
import { adminCustomFieldsGet, adminCustomFieldsPost, adminCustomFieldsDelete } from "./routes/admin/customFields";
import { adminTasksEditGet, adminTasksEditPost } from "./routes/admin/editTask";
import { adminTasksGet, adminTasksDelete, adminTasksDeleteMany, adminTasksComplete, adminTasksReopen, adminTasksSetCurrentTasks, adminTasksSetTasksPerPage, adminTasksCompleteMany, adminTasksReopenMany } from "./routes/admin/tasks";
import { adminTasksImportGet, adminTasksImportPost } from "./routes/admin/importTasks";
import { adminTasksReassignManyGet, adminTasksReassignManyPost } from "./routes/admin/reassignManyTasks";
import { adminUsersEditGet, adminUsersEditPost } from "./routes/admin/editUser";
import { adminUsersGet, adminUsersDelete } from "./routes/admin/users";
import { changePasswordGet, changePasswordPost } from "./routes/changePassword";
import { completeGet } from "./routes/complete";
import { homeGet } from "./routes/home";
import { loginGet, loginPost } from "./routes/login";
import { logoutGet } from "./routes/logout";
import { registerGet, registerPost } from "./routes/register";
import { saveNotesPost } from "./routes/saveNotes";
import { sendForReviewGet } from "./routes/sendForReview";
import { startGet } from "./routes/start";
const MemoryStore = require("memorystore")(expressSession);

process.chdir(path.join(__dirname, ".."));
const vueOptions: any = {
    rootPath: path.join(__dirname, "routes"),
    vue: {
        head: {
            meta: [
                {
                    name: "viewport",
                    value: "width=device-width, initial-scale=1, shrink-to-fit=no"
                }
            ]
        }
    }
};
const cssFiles = fs.readdirSync(path.join(__dirname, "assets/css"));
for (let i = 0; i < cssFiles.length; i++) {
    const cssFile = cssFiles[i];
    vueOptions.vue.head.meta.push({ style: `/assets/css/${cssFile}` });
}
const jsFiles = fs.readdirSync(path.join(__dirname, "assets/js"));
for (let i = 0; i < jsFiles.length; i++) {
    const jsFile = jsFiles[i];
    vueOptions.vue.head.meta.push({ script: `/assets/js/${jsFile}` });
}
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
            }
        ],
        tasks: [],
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
    app.use(expressFileUpload());
    app.use(bodyParser.urlencoded({ extended: true }));
    app.use((<any>expressVue).init(vueOptions));
    app.use("/assets", express.static(path.join(__dirname, "assets")));
    app.get("/", (req, res) => loginGet(req, res, db));
    app.post("/", (req, res) => loginPost(req, res, db));
    app.get("/home", (req, res) => homeGet(req, res, db));
    app.get("/logout", (req, res) => logoutGet(req, res, db));
    app.get("/changePassword", (req, res) => changePasswordGet(req, res, db));
    app.post("/changePassword", (req, res) => changePasswordPost(req, res, db));
    app.get("/register", (req, res) => registerGet(req, res, db));
    app.post("/register", (req, res) => registerPost(req, res, db));
    app.get("/start", (req, res) => startGet(req, res, db));
    app.get("/sendForReview", (req, res) => sendForReviewGet(req, res, db));
    app.get("/complete", (req, res) => completeGet(req, res, db));
    app.post("/saveNotes", (req, res) => saveNotesPost(req, res, db));
    app.get("/admin/tasks", (req, res) => adminTasksGet(req, res, db));
    app.get("/admin/customFields", (req, res) => adminCustomFieldsGet(req, res, db));
    app.post("/admin/customFields", (req, res) => adminCustomFieldsPost(req, res, db));
    app.get("/admin/customFields/delete", (req, res) => adminCustomFieldsDelete(req, res, db));
    app.get("/admin/tasks/delete", (req, res) => adminTasksDelete(req, res, db));
    app.get("/admin/tasks/deleteMany", (req, res) => adminTasksDeleteMany(req, res, db));
    app.get("/admin/tasks/edit", (req, res) => adminTasksEditGet(req, res, db));
    app.post("/admin/tasks/edit", (req, res) => adminTasksEditPost(req, res, db));
    app.get("/admin/tasks/import", (req, res) => adminTasksImportGet(req, res, db));
    app.post("/admin/tasks/import", (req, res) => adminTasksImportPost(req, res, db));
    app.get("/admin/tasks/reassignMany", (req, res) => adminTasksReassignManyGet(req, res, db));
    app.post("/admin/tasks/reassignMany", (req, res) => adminTasksReassignManyPost(req, res, db));
    app.get("/admin/tasks/complete", (req, res) => adminTasksComplete(req, res, db));
    app.get("/admin/tasks/completeMany", (req, res) => adminTasksCompleteMany(req, res, db));
    app.get("/admin/tasks/reopen", (req, res) => adminTasksReopen(req, res, db));
    app.get("/admin/tasks/reopenMany", (req, res) => adminTasksReopenMany(req, res, db));
    app.get("/admin/tasks/setCurrentTasks", (req, res) => adminTasksSetCurrentTasks(req, res, db));
    app.get("/admin/tasks/setTasksPerPage", (req, res) => adminTasksSetTasksPerPage(req, res, db));
    app.get("/admin/users", (req, res) => adminUsersGet(req, res, db));
    app.get("/admin/users/delete", (req, res) => adminUsersDelete(req, res, db));
    app.get("/admin/users/edit", (req, res) => adminUsersEditGet(req, res, db));
    app.post("/admin/users/edit", (req, res) => adminUsersEditPost(req, res, db));
    app.listen(args.port, () => {
        console.log(`Server has started on port ${args.port}.`);
    });
});

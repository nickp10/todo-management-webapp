import { DBSchema, Task } from "../../interfaces";
import * as express from "express";
import * as expressFileUpload from "express-fileupload";
import * as lowdb from "lowdb";
import * as moment from "moment";
import * as uuid4 from "uuid/v4";
import { adminTasksGet } from "./tasks";
import { homeGet } from "../home";
import { loginGet } from "../login";

export function adminTasksImportGet(req: express.Request, res: express.Response, db: lowdb.Lowdb<DBSchema, lowdb.AdapterAsync>) {
    if (!req.session.user) {
        loginGet(req, res, db);
        return;
    }
    if (!req.session.user.isAdmin) {
        homeGet(req, res, db);
        return;
    }
    const data = {
        nav: {
            isTasks: true
        }
    };
    const vueOptions = {
        head: {
            title: "Todo Manager Admin - Tasks"
        }
    };
    (<any>res).renderVue("admin/importTasks", data, vueOptions);
};

export function adminTasksImportPost(req: express.Request, res: express.Response, db: lowdb.Lowdb<DBSchema, lowdb.AdapterAsync>) {
    if (!req.session.user) {
        loginGet(req, res, db);
        return;
    }
    if (!req.session.user.isAdmin) {
        homeGet(req, res, db);
        return;
    }
    if (req.files && req.files.importFile) {
        const file = <expressFileUpload.UploadedFile>req.files.importFile;
        const data = file.data.toString("UTF8");
        if (data) {
            const customFields = db.get("customFields").value();
            const lines = data.split(/\r?\n/);
            for (let i = 0; i < lines.length; i++) {
                const line = lines[i];
                const columns = line.split(/,/);
                if (columns.length >= 4) {
                    const assignee = db.get("users").find({ username: columns[2] }).value();
                    const task: Task = {
                        id: uuid4(),
                        title: columns[0],
                        description: columns[1],
                        assignee: assignee ? assignee.id : undefined,
                        deadline: new Date(columns[3]),
                        status: "Not Started"
                    };
                    for (let j = 4; j < columns.length; j++) {
                        if (customFields.length > j - 4) {
                            const customField = customFields[j - 4];
                            const value = columns[j];
                            task[customField.id] = value;
                        }
                    }
                    db.get("tasks").push(task).write();
                }
            }
        }
    }
    adminTasksGet(req, res, db);
};

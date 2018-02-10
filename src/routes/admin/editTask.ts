import { DBSchema, Task } from "../../interfaces";
import * as express from "express";
import * as lowdb from "lowdb";
import * as moment from "moment";
import * as uuid4 from "uuid/v4";
import { adminTasksGet } from "./tasks";
import { homeGet } from "../home";
import { loginGet } from "../login";

export function adminTasksEditGet(req: express.Request, res: express.Response, db: lowdb.Lowdb<DBSchema, lowdb.AdapterAsync>) {
    if (!req.session.user) {
        loginGet(req, res, db);
        return;
    }
    if (!req.session.user.isAdmin) {
        homeGet(req, res, db);
        return;
    }
    const task: any = db.get("tasks").find({ id: req.query.id }).value() || { };
    task.assignee = task.assignee || "";
    const users = db.get("users").value();
    const data = { task: task, users: users };
    const vueOptions = {
        head: {
            title: "Todo Manager Admin - Tasks"
        }
    };
    (<any>res).renderVue("admin/editTask", data, vueOptions);
};

export function adminTasksEditPost(req: express.Request, res: express.Response, db: lowdb.Lowdb<DBSchema, lowdb.AdapterAsync>) {
    if (!req.session.user) {
        loginGet(req, res, db);
        return;
    }
    if (!req.session.user.isAdmin) {
        homeGet(req, res, db);
        return;
    }
    const existingTask = db.get("tasks").find({ id: req.query.id }).value();
    const updatedTask: Task = {
        id: existingTask ? existingTask.id : uuid4(),
        title: req.body.title,
        description: req.body.description,
        assignee: req.body.assignee,
        deadline: moment(req.body.deadline).toDate(),
        status: existingTask ? existingTask.status : "Not Started"
    };
    if (existingTask) {
        db.get("tasks").find({ id: req.query.id }).assign(updatedTask).write();
    } else {
        db.get("tasks").push(updatedTask).write();
    }
    adminTasksGet(req, res, db);
};

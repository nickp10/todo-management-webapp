import { DBSchema, Task, User } from "../../interfaces";
import * as express from "express";
import * as lowdb from "lowdb";
import * as moment from "moment";
import { v4 as uuid4 } from "uuid";
import { adminTasksGet } from "./tasks";
import { homeGet } from "../home";
import { loginGet } from "../login";

function adminTasksEditGetHelper(req: express.Request, res: express.Response, db: lowdb.LowdbAsync<DBSchema>, taskId: string, error?: string) {
    if (!req.session.user) {
        loginGet(req, res, db);
        return;
    }
    if (!req.session.user.isAdmin) {
        homeGet(req, res, db);
        return;
    }
    const task: any = db.get("tasks").find({ id: taskId }).value() || { id: "" };
    task.assignee = task.assignee || "";
    const users = db.get("users").value();
    const customFields = db.get("customFields").value();
    const data = {
        task: task,
        users: users,
        customFields: customFields,
        error: error || "",
        nav: {
            isTasks: true
        }
    };
    const vueOptions = {
        head: {
            title: "Todo Manager Admin - Tasks"
        }
    };
    (<any>res).renderVue("admin/editTask", data, vueOptions);
}

export function adminTasksEditGet(req: express.Request, res: express.Response, db: lowdb.LowdbAsync<DBSchema>) {
    adminTasksEditGetHelper(req, res, db, <string>req.query.id);
};

export function adminTasksEditPost(req: express.Request, res: express.Response, db: lowdb.LowdbAsync<DBSchema>) {
    if (!req.session.user) {
        loginGet(req, res, db);
        return;
    }
    if (!req.session.user.isAdmin) {
        homeGet(req, res, db);
        return;
    }
    const existingTask = <Task>db.get("tasks").find({ id: <string>req.query.id }).value();
    let error = "";
    let assigneeValue = req.body.assignee;
    const assignee = <User>db.get("users").find({ id: assigneeValue }).value();
    if (assignee) {
        const assigneeTasks = db.get("tasks").filter({ assignee: assignee.id }).value();
        if (!existingTask || existingTask.assignee !== assignee.id) {
            if (assignee.maxTasks === assigneeTasks.length) {
                error = "The assigned user already has the maximum number of tasks assigned to them.";
                assigneeValue = existingTask ? existingTask.assignee : undefined;
            }
        }
    }
    const updatedTask: Task = {
        id: existingTask ? existingTask.id : uuid4(),
        dateCreated: existingTask ? existingTask.dateCreated : new Date(),
        title: req.body.title,
        description: req.body.description,
        assignee: assigneeValue,
        deadline: moment(req.body.deadline).toDate(),
        status: existingTask ? existingTask.status : "Not Started",
        notes: req.body.notes
    };
    const customFields = db.get("customFields").value();
    for (let i = 0; i < customFields.length; i++) {
        const customField = customFields[i];
        updatedTask[customField.id] = req.body[customField.id];
    }
    if (existingTask) {
        db.get("tasks").find({ id: <string>req.query.id }).assign(updatedTask).write();
    } else {
        db.get("tasks").push(updatedTask).write();
    }
    if (error) {
        adminTasksEditGetHelper(req, res, db, updatedTask.id, error);
    } else {
        adminTasksGet(req, res, db);
    }
};

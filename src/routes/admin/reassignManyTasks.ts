import { DBSchema, Task, User } from "../../interfaces";
import * as express from "express";
import * as lowdb from "lowdb";
import * as moment from "moment";
import * as uuid4 from "uuid/v4";
import { adminTasksGet } from "./tasks";
import { homeGet } from "../home";
import { loginGet } from "../login";

function adminTasksReassignManyGetHelper(req: express.Request, res: express.Response, db: lowdb.LowdbAsync<DBSchema>, taskIds: string, error?: string) {
    if (!req.session.user) {
        loginGet(req, res, db);
        return;
    }
    if (!req.session.user.isAdmin) {
        homeGet(req, res, db);
        return;
    }
    const users = db.get("users").value();
    const data = {
        taskIds: taskIds,
        users: users,
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
    (<any>res).renderVue("admin/reassignManyTasks", data, vueOptions);
}

export function adminTasksReassignManyGet(req: express.Request, res: express.Response, db: lowdb.LowdbAsync<DBSchema>) {
    adminTasksReassignManyGetHelper(req, res, db, req.query.ids);
};

export function adminTasksReassignManyPost(req: express.Request, res: express.Response, db: lowdb.LowdbAsync<DBSchema>) {
    if (!req.session.user) {
        loginGet(req, res, db);
        return;
    }
    if (!req.session.user.isAdmin) {
        homeGet(req, res, db);
        return;
    }
    const taskIds = req.query.ids.split(",");
    let error = "";
    let assigneeValue = req.body.assignee;
    const assignee = <User>db.get("users").find({ id: assigneeValue }).value();
    if (assignee) {
        const assigneeTasks = <Task[]>db.get("tasks").filter({ assignee: assignee.id }).value();
        const newTaskIds = [];
        for (let i = 0; i < taskIds.length; i++) {
            const taskId = taskIds[i];
            let found = false;
            for (let j = 0; j < assigneeTasks.length; j++) {
                const assigneeTask = assigneeTasks[j];
                if (assigneeTask.id === taskId) {
                    found = true;
                    break;
                }
            }
            if (!found) {
                newTaskIds.push(taskId);
            }
        }
        if (assignee.maxTasks < assigneeTasks.length + newTaskIds.length) {
            error = "The assigned user cannot be assigned to all the selected tasks since they will exceed the maximum number of tasks assigned to them.";
            adminTasksReassignManyGetHelper(req, res, db, req.query.ids, error);
            return;
        }
    }
    for (let i = 0; i < taskIds.length; i++) {
        const taskId = taskIds[i];
        db.get("tasks").find({ id: taskId }).assign({ assignee: assigneeValue }).value();
    }
    db.write();
    adminTasksGet(req, res, db);
};

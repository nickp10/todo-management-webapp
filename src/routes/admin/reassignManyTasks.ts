import { DBSchema, Task } from "../../interfaces";
import * as express from "express";
import * as lowdb from "lowdb";
import * as moment from "moment";
import * as uuid4 from "uuid/v4";
import { adminTasksGet, adminTasksGetHelper, getStatusTag } from "./tasks";
import { homeGet } from "../home";
import { loginGet } from "../login";

function adminTasksReassignManyGetHelper(req: express.Request, res: express.Response, db: lowdb.Lowdb<DBSchema, lowdb.AdapterAsync>, taskIds: string, error?: string) {
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

export function adminTasksReassignManyGet(req: express.Request, res: express.Response, db: lowdb.Lowdb<DBSchema, lowdb.AdapterAsync>) {
    adminTasksReassignManyGetHelper(req, res, db, req.query.ids);
};

export function adminTasksReassignManyPost(req: express.Request, res: express.Response, db: lowdb.Lowdb<DBSchema, lowdb.AdapterAsync>) {
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
    const assignee = db.get("users").find({ id: assigneeValue }).value();
    if (assignee) {
        const assigneeTasks = db.get("tasks").filter({ assignee: assignee.id }).value();
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
    let currentTasks = "";
    for (let i = 0; i < taskIds.length; i++) {
        const taskId = taskIds[i];
        if (!currentTasks) {
            const task = db.get("tasks").find({ id: taskId }).value();
            if (task) {
                currentTasks = getStatusTag(task.status);
            }
        }
        db.get("tasks").find({ id: taskId }).assign({ assignee: assigneeValue }).value();
    }
    db.write();
    if (currentTasks) {
        adminTasksGetHelper(req, res, db, currentTasks);
    } else {
        adminTasksGet(req, res, db);
    }
};

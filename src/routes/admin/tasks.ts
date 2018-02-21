import { DBSchema } from "../../interfaces";
import * as express from "express";
import * as lowdb from "lowdb";
import * as moment from "moment";
import { homeGet } from "../home";
import { loginGet } from "../login";

export function adminTasksGet(req: express.Request, res: express.Response, db: lowdb.Lowdb<DBSchema, lowdb.AdapterAsync>) {
    if (!req.session.user) {
        loginGet(req, res, db);
        return;
    }
    if (!req.session.user.isAdmin) {
        homeGet(req, res, db);
        return;
    }
    const tasks = db.get("tasks").sortBy("dateCreated").value().reverse();
    const users = db.get("users").value();
    const customFields = db.get("customFields").value();
    const data = {
        users: users,
        customFields: customFields,
        currentTasks: req.session.currentTasks || "#notStarted",
        tasksPerPage: req.session.tasksPerPage || 10,
        tasks: {
            "#notStarted": tasks.filter(t => t.status === "Not Started"),
            "#inProgress": tasks.filter(t => t.status === "In Progress"),
            "#inReview": tasks.filter(t => t.status === "In Review"),
            "#completed": tasks.filter(t => t.status === "Completed")
        },
        nav: {
            isTasks: true
        }
    };
    const vueOptions = {
        head: {
            title: "Todo Manager Admin - Tasks"
        }
    };
    (<any>res).renderVue("admin/tasks", data, vueOptions);
};

export function adminTasksDelete(req: express.Request, res: express.Response, db: lowdb.Lowdb<DBSchema, lowdb.AdapterAsync>) {
    if (!req.session.user) {
        loginGet(req, res, db);
        return;
    }
    if (!req.session.user.isAdmin) {
        homeGet(req, res, db);
        return;
    }
    db.get("tasks").remove({ id: req.query.id }).write();
    adminTasksGet(req, res, db);
};

export function adminTasksDeleteMany(req: express.Request, res: express.Response, db: lowdb.Lowdb<DBSchema, lowdb.AdapterAsync>) {
    if (!req.session.user) {
        loginGet(req, res, db);
        return;
    }
    if (!req.session.user.isAdmin) {
        homeGet(req, res, db);
        return;
    }
    const ids = req.query.ids.split(",");
    for (let i = 0; i < ids.length; i++) {
        const id = ids[i];
        db.get("tasks").remove({ id: id }).value();
    }
    db.write();
    adminTasksGet(req, res, db);
};

export function adminTasksComplete(req: express.Request, res: express.Response, db: lowdb.Lowdb<DBSchema, lowdb.AdapterAsync>) {
    if (!req.session.user) {
        loginGet(req, res, db);
        return;
    }
    if (!req.session.user.isAdmin) {
        homeGet(req, res, db);
        return;
    }
    db.get("tasks").find({ id: req.query.id }).assign({ dateCompleted: new Date(), status: "Completed", completedBy: req.session.user.id }).write();
    adminTasksGet(req, res, db);
};

export function adminTasksCompleteMany(req: express.Request, res: express.Response, db: lowdb.Lowdb<DBSchema, lowdb.AdapterAsync>) {
    if (!req.session.user) {
        loginGet(req, res, db);
        return;
    }
    if (!req.session.user.isAdmin) {
        homeGet(req, res, db);
        return;
    }
    const ids = req.query.ids.split(",");
    for (let i = 0; i < ids.length; i++) {
        const id = ids[i];
        db.get("tasks").find({ id: id }).assign({ dateCompleted: new Date(), status: "Completed", completedBy: req.session.user.id }).value();
    }
    db.write();
    adminTasksGet(req, res, db);
};

export function adminTasksReopen(req: express.Request, res: express.Response, db: lowdb.Lowdb<DBSchema, lowdb.AdapterAsync>) {
    if (!req.session.user) {
        loginGet(req, res, db);
        return;
    }
    if (!req.session.user.isAdmin) {
        homeGet(req, res, db);
        return;
    }
    db.get("tasks").find({ id: req.query.id }).assign({ dateStarted: "", dateCompleted: "", dateSentForReview: "", completedBy: "", status: "Not Started" }).write();
    adminTasksGet(req, res, db);
};

export function adminTasksReopenMany(req: express.Request, res: express.Response, db: lowdb.Lowdb<DBSchema, lowdb.AdapterAsync>) {
    if (!req.session.user) {
        loginGet(req, res, db);
        return;
    }
    if (!req.session.user.isAdmin) {
        homeGet(req, res, db);
        return;
    }
    const ids = req.query.ids.split(",");
    for (let i = 0; i < ids.length; i++) {
        const id = ids[i];
        db.get("tasks").find({ id: id }).assign({ dateStarted: "", dateCompleted: "", dateSentForReview: "", completedBy: "", status: "Not Started" }).value();
    }
    db.write();
    adminTasksGet(req, res, db);
};

export function adminTasksSetCurrentTasks(req: express.Request, res: express.Response, db: lowdb.Lowdb<DBSchema, lowdb.AdapterAsync>) {
    if (!req.session.user || !req.session.user.isAdmin) {
        res.sendStatus(403);
        return;
    }
    req.session.currentTasks = req.query.currentTasks;
    res.sendStatus(200);
}

export function adminTasksSetTasksPerPage(req: express.Request, res: express.Response, db: lowdb.Lowdb<DBSchema, lowdb.AdapterAsync>) {
    if (!req.session.user || !req.session.user.isAdmin) {
        res.sendStatus(403);
        return;
    }
    req.session.tasksPerPage = req.query.tasksPerPage;
    res.sendStatus(200);
}

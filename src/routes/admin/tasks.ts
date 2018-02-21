import { DBSchema } from "../../interfaces";
import * as express from "express";
import * as lowdb from "lowdb";
import * as moment from "moment";
import * as utils from "../../utils";
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
        currentTasks: req.session.user.adminCurrentTasksTab || "Not Started",
        tasksPerPage: req.session.user.adminTasksPerPage || 10,
        tasks: {
            "Not Started": tasks.filter(t => t.status === "Not Started"),
            "In Progress": tasks.filter(t => t.status === "In Progress"),
            "In Review": tasks.filter(t => t.status === "In Review"),
            "Completed": tasks.filter(t => t.status === "Completed")
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
    req.session.user.adminCurrentTasksTab = req.query.currentTasks;
    db.get("users").find({ id: req.session.user.id }).assign({ adminCurrentTasksTab: req.session.user.adminCurrentTasksTab }).write();
    res.setHeader("Cache-Control", "no-cache, no-store, must-revalidate");
    res.setHeader("Pragma", "no-cache");
    res.setHeader("Expires", "0");
    res.sendStatus(200);
}

export function adminTasksSetTasksPerPage(req: express.Request, res: express.Response, db: lowdb.Lowdb<DBSchema, lowdb.AdapterAsync>) {
    if (!req.session.user || !req.session.user.isAdmin) {
        res.sendStatus(403);
        return;
    }
    req.session.user.adminTasksPerPage = utils.coerceInt(req.query.tasksPerPage);
    db.get("users").find({ id: req.session.user.id }).assign({ adminTasksPerPage: req.session.user.adminTasksPerPage }).write();
    res.setHeader("Cache-Control", "no-cache, no-store, must-revalidate");
    res.setHeader("Pragma", "no-cache");
    res.setHeader("Expires", "0");
    res.sendStatus(200);
}

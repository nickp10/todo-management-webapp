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
        currentTasks: "#notStarted",
        tasks: {
            "#notStarted": tasks.filter(t => t.status === "Not Started"),
            "#inProgress": tasks.filter(t => t.status === "In Progress"),
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

export function adminTasksReopen(req: express.Request, res: express.Response, db: lowdb.Lowdb<DBSchema, lowdb.AdapterAsync>) {
    if (!req.session.user) {
        loginGet(req, res, db);
        return;
    }
    if (!req.session.user.isAdmin) {
        homeGet(req, res, db);
        return;
    }
    db.get("tasks").find({ id: req.query.id }).assign({ dateStarted: "", dateCompleted: "", status: "Not Started" }).write();
    adminTasksGet(req, res, db);
};

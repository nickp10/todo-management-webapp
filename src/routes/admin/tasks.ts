import { DBSchema } from "../../interfaces";
import * as express from "express";
import * as lowdb from "lowdb";
import * as moment from "moment";
import { homeGet } from "../home";
import { loginGet } from "../login";

function getStatusTag(status: string) {
    if (status === "Not Started") {
        return "#notStarted";
    } else if (status === "In Progress") {
        return "#inProgress";
    } else if (status === "In Review") {
        return "#inReview";
    } else if (status === "Completed") {
        return "#completed";
    }
    return "#notStarted";
}

function adminTasksGetHelper(req: express.Request, res: express.Response, db: lowdb.Lowdb<DBSchema, lowdb.AdapterAsync>, currentTasks: string) {
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
        currentTasks: currentTasks,
        searchText: "",
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
}

export function adminTasksGet(req: express.Request, res: express.Response, db: lowdb.Lowdb<DBSchema, lowdb.AdapterAsync>) {
    adminTasksGetHelper(req, res, db, "#notStarted");
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
    const task = db.get("tasks").find({ id: req.query.id }).value();
    if (task) {
        const currentTasks = getStatusTag(task.status);
        db.get("tasks").remove({ id: req.query.id }).write();
        adminTasksGetHelper(req, res, db, currentTasks);
    } else {
        adminTasksGet(req, res, db);
    }
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
    const task = db.get("tasks").find({ id: req.query.id }).value();
    if (task) {
        const currentTasks = getStatusTag(task.status);
        db.get("tasks").find({ id: req.query.id }).assign({ dateCompleted: new Date(), status: "Completed", completedBy: req.session.user.id }).write();
        adminTasksGetHelper(req, res, db, currentTasks);
    } else {
        adminTasksGet(req, res, db);
    }
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
    const task = db.get("tasks").find({ id: req.query.id }).value();
    if (task) {
        const currentTasks = getStatusTag(task.status);
        db.get("tasks").find({ id: req.query.id }).assign({ dateStarted: "", dateCompleted: "", dateSentForReview: "", completedBy: "", status: "Not Started" }).write();
        adminTasksGetHelper(req, res, db, currentTasks);
    } else {
        adminTasksGet(req, res, db);
    }
};

import { DBSchema } from "../interfaces";
import * as express from "express";
import * as lowdb from "lowdb";
import * as moment from "moment";
import { loginGet } from "./login";

export function homeGet(req: express.Request, res: express.Response, db: lowdb.Lowdb<DBSchema, lowdb.AdapterAsync>) {
    if (!req.session.user) {
        loginGet(req, res, db);
        return;
    }
    let task = db.get("tasks").find({ assignee: req.session.user.id, status: "Started" }).value();
    if (!task) {
        task = db.get("tasks").find({ assignee: req.session.user.id, status: "Not Started" }).value();
    }
    const data = { task: task };
    const vueOptions = {
        head: {
            title: "Todo Manager - Home"
        }
    };
    if (task) {
        const deadline = task.deadline ? moment(task.deadline).format("MM/DD/YYYY hh:mm:ss A") : "No deadline set";
        (<any>res).renderVue("home", { task: task, deadline: deadline }, vueOptions);
    } else {
        (<any>res).renderVue("homeEmpty", { }, vueOptions);
    }
};

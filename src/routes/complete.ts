import { DBSchema } from "../interfaces";
import * as express from "express";
import * as lowdb from "lowdb";
import { homeGet } from "./home";
import { loginGet } from "./login";

export function completeGet(req: express.Request, res: express.Response, db: lowdb.LowdbAsync<DBSchema>) {
    if (!req.session.user) {
        loginGet(req, res, db);
        return;
    }
    db.get("tasks").find({ id: <string>req.query.id }).assign({ dateCompleted: new Date(), status: "Completed", completedBy: req.session.user.id }).write();
    homeGet(req, res, db);
};

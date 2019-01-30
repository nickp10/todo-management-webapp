import { DBSchema } from "../interfaces";
import * as express from "express";
import * as lowdb from "lowdb";
import { homeGet } from "./home";
import { loginGet } from "./login";

export function startGet(req: express.Request, res: express.Response, db: lowdb.LowdbAsync<DBSchema>) {
    if (!req.session.user) {
        loginGet(req, res, db);
        return;
    }
    db.get("tasks").find({ id: req.query.id }).assign({ dateStarted: new Date(), status: "In Progress" }).write();
    homeGet(req, res, db);
};

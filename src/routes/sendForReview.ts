import { DBSchema } from "../interfaces";
import * as express from "express";
import * as lowdb from "lowdb";
import { homeGet } from "./home";
import { loginGet } from "./login";

export function sendForReviewGet(req: express.Request, res: express.Response, db: lowdb.LowdbAsync<DBSchema>) {
    if (!req.session.user) {
        loginGet(req, res, db);
        return;
    }
    db.get("tasks").find({ id: req.query.id }).assign({ dateSentForReview: new Date(), status: "In Review" }).write();
    homeGet(req, res, db);
};

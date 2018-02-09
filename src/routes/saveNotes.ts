import { DBSchema } from "../interfaces";
import * as express from "express";
import * as lowdb from "lowdb";
import { homeGet } from "./home";
import { loginGet } from "./login";

export function saveNotesPost(req: express.Request, res: express.Response, db: lowdb.Lowdb<DBSchema, lowdb.AdapterAsync>) {
    if (!req.session.user) {
        loginGet(req, res, db);
        return;
    }
    db.get("tasks").find({ id: req.query.id }).assign({ notes: req.body.notes }).write();
    homeGet(req, res, db);
};

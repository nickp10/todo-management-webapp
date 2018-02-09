import { DBSchema } from "../interfaces";
import * as express from "express";
import * as lowdb from "lowdb";
import { loginGet } from "./login";

export function logoutGet(req: express.Request, res: express.Response, db: lowdb.Lowdb<DBSchema, lowdb.AdapterAsync>) {
    req.session.user = undefined;
    loginGet(req, res, db);
};

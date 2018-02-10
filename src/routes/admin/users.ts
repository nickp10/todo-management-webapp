import { DBSchema } from "../../interfaces";
import * as express from "express";
import * as lowdb from "lowdb";
import * as moment from "moment";
import { homeGet } from "../home";
import { loginGet } from "../login";

export function adminUsersGet(req: express.Request, res: express.Response, db: lowdb.Lowdb<DBSchema, lowdb.AdapterAsync>) {
    if (!req.session.user) {
        loginGet(req, res, db);
        return;
    }
    if (!req.session.user.isAdmin) {
        homeGet(req, res, db);
        return;
    }
    const users = db.get("users").value();
    const data = { users: users };
    const vueOptions = {
        head: {
            title: "Todo Manager Admin - Users"
        }
    };
    (<any>res).renderVue("admin/users", data, vueOptions);
};

export function adminUsersDelete(req: express.Request, res: express.Response, db: lowdb.Lowdb<DBSchema, lowdb.AdapterAsync>) {
    if (!req.session.user) {
        loginGet(req, res, db);
        return;
    }
    if (!req.session.user.isAdmin) {
        homeGet(req, res, db);
        return;
    }
    db.get("users").remove({ id: req.query.id }).write();
    adminUsersGet(req, res, db);
};

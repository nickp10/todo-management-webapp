import { DBSchema, User } from "../../interfaces";
import * as crypto from "crypto-js";
import * as express from "express";
import * as lowdb from "lowdb";
import * as utils from "../../utils";
import * as uuid4 from "uuid/v4";
import { adminUsersGet } from "./users";
import { homeGet } from "../home";
import { loginGet } from "../login";

export function adminUsersEditGet(req: express.Request, res: express.Response, db: lowdb.Lowdb<DBSchema, lowdb.AdapterAsync>) {
    if (!req.session.user) {
        loginGet(req, res, db);
        return;
    }
    if (!req.session.user.isAdmin) {
        homeGet(req, res, db);
        return;
    }
    const user: any = db.get("users").find({ id: req.query.id }).value() || { };
    if (user && user.isRoot) {
        adminUsersGet(req, res, db);
        return;
    }
    user.maxTasks = user.maxTasks || 100;
    const data = {
        user: user,
        nav: {
            isUsers: true
        }
    };
    const vueOptions = {
        head: {
            title: "Todo Manager Admin - Users"
        }
    };
    (<any>res).renderVue("admin/editUser", data, vueOptions);
};

export function adminUsersEditPost(req: express.Request, res: express.Response, db: lowdb.Lowdb<DBSchema, lowdb.AdapterAsync>) {
    if (!req.session.user) {
        loginGet(req, res, db);
        return;
    }
    if (!req.session.user.isAdmin) {
        homeGet(req, res, db);
        return;
    }
    const existingUser = db.get("users").find({ id: req.query.id }).value();
    if (existingUser && existingUser.isRoot) {
        adminUsersGet(req, res, db);
        return;
    }
    let password = "";
    if (existingUser) {
        password = existingUser.password;
    }
    if (req.body.password) {
        password = crypto.SHA256(req.body.password).toString();
    }
    if (!password) {
        adminUsersGet(req, res, db);
        return;
    }
    const updatedUser: User = {
        id: existingUser ? existingUser.id : uuid4(),
        username: req.body.username,
        password: password,
        maxTasks: utils.coerceInt(req.body.maxTasks) || 100,
        isAdmin: !!req.body.isAdmin,
        isRoot: false
    };
    if (existingUser) {
        db.get("users").find({ id: req.query.id }).assign(updatedUser).write();
    } else {
        db.get("users").push(updatedUser).write();
    }
    adminUsersGet(req, res, db);
};

import { DBSchema, User } from "../../interfaces";
import * as crypto from "crypto-js";
import * as express from "express";
import * as lowdb from "lowdb";
import * as utils from "../../utils";
import * as uuid4 from "uuid/v4";
import { adminUsersGet } from "./users";
import { homeGet } from "../home";
import { loginGet } from "../login";

function adminUsersEditGetHelper(req: express.Request, res: express.Response, db: lowdb.Lowdb<DBSchema, lowdb.AdapterAsync>, userId: string, error?: string) {
    if (!req.session.user) {
        loginGet(req, res, db);
        return;
    }
    if (!req.session.user.isAdmin) {
        homeGet(req, res, db);
        return;
    }
    const user: any = db.get("users").find({ id: userId }).value() || { id: "" };
    user.maxTasks = user.maxTasks || 100;
    const data = {
        error: error || "",
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

export function adminUsersEditGet(req: express.Request, res: express.Response, db: lowdb.Lowdb<DBSchema, lowdb.AdapterAsync>) {
    adminUsersEditGetHelper(req, res, db, req.query.id);
}

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
    let password = "";
    if (existingUser) {
        password = existingUser.password;
    }
    if (req.body.password) {
        password = crypto.SHA256(req.body.password).toString();
    }
    if (!password) {
        adminUsersEditGetHelper(req, res, db, existingUser ? existingUser.id : "", "Password is required.");
        return;
    }
    if (!existingUser || existingUser.username !== req.body.username) {
        const userMatchByUsername = db.get("users").find({ username: req.body.username }).value();
        if (userMatchByUsername) {
            adminUsersEditGetHelper(req, res, db, existingUser ? existingUser.id : "", "A user already exists with the specified username.");
            return;
        }
    }
    const updatedUser: User = {
        id: existingUser ? existingUser.id : uuid4(),
        username: req.body.username,
        password: password,
        maxTasks: utils.coerceInt(req.body.maxTasks) || 100,
        isAdmin: !!req.body.isAdmin || (existingUser ? existingUser.isRoot : false),
        isRoot: existingUser ? existingUser.isRoot : false
    };
    if (existingUser) {
        db.get("users").find({ id: req.query.id }).assign(updatedUser).write();
    } else {
        db.get("users").push(updatedUser).write();
    }
    adminUsersGet(req, res, db);
};

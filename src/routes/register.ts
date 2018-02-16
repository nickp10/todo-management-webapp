import { DBSchema, User } from "../interfaces";
import * as crypto from "crypto-js";
import * as express from "express";
import * as lowdb from "lowdb";
import * as uuid4 from "uuid/v4";
import { homeGet } from "./home";

function registerGetHelper(req: express.Request, res: express.Response, db: lowdb.Lowdb<DBSchema, lowdb.AdapterAsync>, error?: string) {
    if (req.session.user) {
        homeGet(req, res, db);
        return;
    }
    const data = { error: error || "" };
    const vueOptions = {
        head: {
            title: "Todo Manager - Register"
        }
    };
    (<any>res).renderVue("register", data, vueOptions);
};

export function registerGet(req: express.Request, res: express.Response, db: lowdb.Lowdb<DBSchema, lowdb.AdapterAsync>) {
    registerGetHelper(req, res, db);
}

export function registerPost(req: express.Request, res: express.Response, db: lowdb.Lowdb<DBSchema, lowdb.AdapterAsync>) {
    if (req.session.user) {
        homeGet(req, res, db);
        return;
    }
    const username = req.body.username;
    const password = req.body.password;
    const confirmPassword = req.body.confirmPassword;
    if (!username || !password || !confirmPassword) {
        registerGetHelper(req, res, db, "All fields are required.");
        return;
    }
    const user = db.get("users").find({ username: username }).value();
    if (user) {
        registerGetHelper(req, res, db, "A user already exists with the specified username.");
        return;
    }
    if (password !== confirmPassword) {
        registerGetHelper(req, res, db, "Password and confirm password must match.");
        return;
    }
    const newUser: User = {
        id: uuid4(),
        username: username,
        password: crypto.SHA256(password).toString(),
        maxTasks: 100,
        isAdmin: false,
        isRoot: false
    };
    db.get("users").push(newUser).write();
    req.session.user = newUser;
    homeGet(req, res, db);
}

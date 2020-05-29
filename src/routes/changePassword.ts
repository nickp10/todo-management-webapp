import { DBSchema, User } from "../interfaces";
import * as crypto from "crypto-js";
import * as express from "express";
import * as lowdb from "lowdb";
import { v4 as uuid4 } from "uuid";
import { homeGet } from "./home";
import { loginGet } from "./login";

function changePasswordGetHelper(req: express.Request, res: express.Response, db: lowdb.LowdbAsync<DBSchema>, error?: string) {
    if (!req.session.user) {
        loginGet(req, res, db);
        return;
    }
    const data = { error: error || "", isAdmin: req.session.user.isAdmin };
    const vueOptions = {
        head: {
            title: "Todo Manager - Change Password"
        }
    };
    (<any>res).renderVue("changePassword", data, vueOptions);
};

export function changePasswordGet(req: express.Request, res: express.Response, db: lowdb.LowdbAsync<DBSchema>) {
    changePasswordGetHelper(req, res, db);
}

export function changePasswordPost(req: express.Request, res: express.Response, db: lowdb.LowdbAsync<DBSchema>) {
    if (!req.session.user) {
        loginGet(req, res, db);
        return;
    }
    const currentPassword = req.body.currentPassword;
    const password = req.body.password;
    const confirmPassword = req.body.confirmPassword;
    if (!currentPassword || !password || !confirmPassword) {
        changePasswordGetHelper(req, res, db, "All fields are required.");
        return;
    }
    const user: User = req.session.user;
    if (crypto.SHA256(currentPassword).toString() !== user.password) {
        changePasswordGetHelper(req, res, db, "An incorrect current password was entered.");
        return;
    }
    if (password !== confirmPassword) {
        changePasswordGetHelper(req, res, db, "New password and confirm password must match.");
        return;
    }
    user.password = crypto.SHA256(password).toString();
    db.get("users").find({ id: user.id }).assign(user).write();
    homeGet(req, res, db);
}

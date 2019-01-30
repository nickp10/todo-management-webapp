import * as crypto from "crypto-js";
import { DBSchema } from "../interfaces";
import * as express from "express";
import * as lowdb from "lowdb";
import { homeGet } from "./home";

export function loginGet(req: express.Request, res: express.Response, db: lowdb.LowdbAsync<DBSchema>) {
    if (req.session.user) {
        homeGet(req, res, db);
        return;
    }
    const data = { error: "" };
    const vueOptions = {
        head: {
            title: "Todo Manager - Login"
        }
    };
    (<any>res).renderVue("login", data, vueOptions);
};

export function loginPost(req: express.Request, res: express.Response, db: lowdb.LowdbAsync<DBSchema>) {
    if (req.session.user) {
        homeGet(req, res, db);
        return;
    }
    const findUser = {
        username: req.body.username,
        password: crypto.SHA256(req.body.password).toString()
    };
    const user = db.get("users").find(findUser).value();
    if (!user) {
        const data = { error: "Invalid username or password" };
        const vueOptions = {
            head: {
                title: "Todo Manager - Login"
            }
        };
        (<any>res).renderVue("login", data, vueOptions);
    } else {
        req.session.user = user;
        homeGet(req, res, db);
    }
}

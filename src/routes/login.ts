import * as crypto from "crypto-js";
import { DBSchema } from "../interfaces";
import * as express from "express";
import * as lowdb from "lowdb";

export default (router: express.Express, db: lowdb.Lowdb<DBSchema, lowdb.AdapterAsync>) => {
    router.get("/", (req, res) => {
        const data = {
            title: "Login"
        };
        const vueOptions = {
            head: {
                title: "Todo Manager - Login"
            }
        };
        (<any>res).renderVue("login", data, vueOptions);
    });
    router.post("/", (req, res) => {
        const findUser = {
            username: req.body.username,
            password: crypto.SHA256(req.body.password).toString()
        };
        const user = db.get("users").find(findUser).value();
        if (!user) {
            res.status(403).send("Not authenticated");
        } else {
            res.status(200).send("Hi");
        }
    });
};

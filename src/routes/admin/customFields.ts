import { DBSchema, Field } from "../../interfaces";
import * as express from "express";
import * as lowdb from "lowdb";
import * as uuid4 from "uuid/v4";
import { homeGet } from "../home";
import { loginGet } from "../login";

export function adminCustomFieldsGet(req: express.Request, res: express.Response, db: lowdb.Lowdb<DBSchema, lowdb.AdapterAsync>) {
    if (!req.session.user) {
        loginGet(req, res, db);
        return;
    }
    if (!req.session.user.isAdmin) {
        homeGet(req, res, db);
        return;
    }
    const customFields = db.get("customFields").value();
    const data = {
        customFields: customFields,
        nav: {
            isCustomFields: true
        }
    };
    const vueOptions = {
        head: {
            title: "Todo Manager Admin - Custom Fields"
        }
    };
    (<any>res).renderVue("admin/customFields", data, vueOptions);
};

export function adminCustomFieldsPost(req: express.Request, res: express.Response, db: lowdb.Lowdb<DBSchema, lowdb.AdapterAsync>) {
    if (!req.session.user) {
        loginGet(req, res, db);
        return;
    }
    if (!req.session.user.isAdmin) {
        homeGet(req, res, db);
        return;
    }
    const customField: Field = {
        id: uuid4(),
        name: req.body.name
    };
    db.get("customFields").push(customField).write();
    adminCustomFieldsGet(req, res, db);
};

export function adminCustomFieldsDelete(req: express.Request, res: express.Response, db: lowdb.Lowdb<DBSchema, lowdb.AdapterAsync>) {
    if (!req.session.user) {
        loginGet(req, res, db);
        return;
    }
    if (!req.session.user.isAdmin) {
        homeGet(req, res, db);
        return;
    }
    db.get("customFields").remove({ id: req.query.id }).write();
    adminCustomFieldsGet(req, res, db);
};

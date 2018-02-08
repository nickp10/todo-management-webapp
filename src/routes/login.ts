import * as express from "express";

export default (router: express.Express) => {
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
};

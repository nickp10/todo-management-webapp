#! /usr/bin/env node

import * as args from "./args";
import * as express from "express";
import expressVue = require("express-vue");
import login from "./routes/login";
import * as path from "path";

const app = express();
const vueOptions = {
    rootPath: path.join(__dirname, "routes"),
    vue: {
        head: {
            meta: [{
                script: "assets/jquery.min.js"
            },
            {
                script: "assets/vue.min.js"
            }]
        }
    }
};
app.use((<any>expressVue).init(vueOptions));
app.use("/assets", express.static(path.join(__dirname, "assets")));
login(app);
app.listen(args.port);

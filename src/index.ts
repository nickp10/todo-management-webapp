import * as args from "./args";
import * as express from "express";

const app = express();
app.get("/", (req, res) => {
    res.status(200).send("Test");
});
app.listen(args.port);
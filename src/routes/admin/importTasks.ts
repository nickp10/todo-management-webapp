import { DBSchema, Task } from "../../interfaces";
import * as express from "express";
import * as expressFileUpload from "express-fileupload";
import * as lowdb from "lowdb";
import * as moment from "moment";
import * as uuid4 from "uuid/v4";
import { adminTasksGet } from "./tasks";
import { homeGet } from "../home";
import { loginGet } from "../login";

export function adminTasksImportGet(req: express.Request, res: express.Response, db: lowdb.LowdbAsync<DBSchema>) {
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
        customFieldsStr: customFields.length ? ", " + customFields.map(field => field.name).join(", ") : "",
        nav: {
            isTasks: true
        }
    };
    const vueOptions = {
        head: {
            title: "Todo Manager Admin - Tasks"
        }
    };
    (<any>res).renderVue("admin/importTasks", data, vueOptions);
};

export function adminTasksImportPost(req: express.Request, res: express.Response, db: lowdb.LowdbAsync<DBSchema>) {
    if (!req.session.user) {
        loginGet(req, res, db);
        return;
    }
    if (!req.session.user.isAdmin) {
        homeGet(req, res, db);
        return;
    }
    if (req.files && req.files.importFile) {
        const file = <expressFileUpload.UploadedFile>req.files.importFile;
        const data = file.data.toString("UTF8");
        if (data) {
            const customFields = db.get("customFields").value();
            const rows = parseCSVFile(data);
            for (let i = 0; i < rows.length; i++) {
                const row = rows[i];
                if (row.length >= 2) {
                    const assignee = row.length >= 3 ? db.get("users").find({ username: row[2] }).value() : undefined;
                    const task: Task = {
                        id: uuid4(),
                        dateCreated: new Date(),
                        title: row[0],
                        description: row[1],
                        assignee: assignee ? assignee.id : undefined,
                        deadline: row.length >= 4 && row[3] ? new Date(row[3]) : undefined,
                        status: "Not Started"
                    };
                    for (let j = 4; j < row.length; j++) {
                        if (customFields.length > j - 4) {
                            const customField = customFields[j - 4];
                            const value = row[j];
                            task[customField.id] = value;
                        }
                    }
                    db.get("tasks").push(task).value();
                }
            }
            db.write();
        }
    }
    adminTasksGet(req, res, db);
};

function parseCSVFile(data: string): string[][] {
    const rows: string[][] = [];
    data = data.replace(/\r\n/g, "\n");
    let currentIndex = 0;
    let currentRowIndex = 0;
    while (currentIndex < data.length) {
        const currentRow = rows[currentRowIndex] || [];
        rows[currentRowIndex] = currentRow;
        if (data[currentIndex] === '"') {
            currentIndex++;
            let value = "";
            let nextQuote = data.indexOf('"', currentIndex);
            while (nextQuote > -1) {
                // Check if the quote is escaped with a following quote
                if (data.length > nextQuote + 1 && data[nextQuote + 1] === '"') {
                    value += data.substr(currentIndex, (nextQuote + 1) - currentIndex);
                    currentIndex = nextQuote + 2;
                    nextQuote = data.indexOf('"', currentIndex);
                } else {
                    value += data.substr(currentIndex, nextQuote - currentIndex)
                    currentIndex = nextQuote + 1;
                    nextQuote = -1;
                }
            }
            currentRow.push(value);
            if (currentIndex < data.length && data[currentIndex] === "\n") {
                currentRowIndex++;
            }
            currentIndex++;
        } else {
            const nextComma = data.indexOf(',', currentIndex);
            const nextLine = data.indexOf('\n', currentIndex);
            if ((nextComma <= -1 || nextLine < nextComma) && nextLine > -1) {
                const value = data.substr(currentIndex, nextLine - currentIndex);
                currentRow.push(value);
                currentIndex = nextLine + 1;
                currentRowIndex++;
            } else if (nextComma > -1) {
                const value = data.substr(currentIndex, nextComma - currentIndex);
                currentRow.push(value);
                currentIndex = nextComma + 1;
            } else {
                const value = data.substr(currentIndex);
                currentRow.push(value);
                currentIndex = data.length;
            }
        }
    }
    return rows;
}

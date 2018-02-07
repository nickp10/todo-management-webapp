import * as argv from "argv";
import * as utils from "./utils";

class Args {
    dbPath: string;
	port: number;

	constructor() {
		const args = argv
            .option({ name: "dbPath", short: "db", type: "string" })
			.option({ name: "port", short: "p", type: "number" })
			.run();
		const argDBPath = args.options["dbPath"];
        const argPort = utils.coerceInt(args.options["port"]);
        this.validate(argDBPath, argPort);
	}

	validate(argDBPath: string, argPort: number): void {
        // Validate dbPath
        this.dbPath = argDBPath || "TodoDB.json";
        if (!this.dbPath) {
            console.error("The -db or --dbPath argument must be supplied.");
            process.exit();
        }

        // Validate port
        this.port = argPort || 8000;
		if (!this.port) {
			console.error("The -p or --port argument must be supplied.");
			process.exit();
		}
	}
}

const args: Args = new Args();
export = args;
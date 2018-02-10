import * as mkdirp from "mkdirp";
import * as os from "os";
import * as process from "process";

class Utils {
	coerceInt(value: string): number {
		const parsed = parseInt(value);
		if (isNaN(parsed) || typeof parsed !== "number") {
			return undefined;
		}
		return parsed;
	}

	getDBPath(): string {
		const penv: any = process.env;
		let home = penv.LOCALAPPDATA;
		if (!home) {
			home = penv.APPDATA;
			if (!home) {
				home = os.homedir();
			}
		}
		const dbDir = `${home}/todo-management-webapp`;
		mkdirp.sync(dbDir);
		return `${dbDir}/TodoDB.json`;
	}
}

const utils: Utils = new Utils();
export = utils;
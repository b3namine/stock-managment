import path from "path";

let dbFilePath = path.join(
	path.dirname(__dirname),
	"extraResources",
	"database.db"
);
if (process.env.WEBPACK_DEV_SERVER_URL) {
	dbFilePath = path.join(__dirname, "../", "extraResources", "database.db");
}

export const knex = require("knex")({
	client: "sqlite3",
	connection: {
		filename: dbFilePath
	},

	useNullAsDefault: true
});

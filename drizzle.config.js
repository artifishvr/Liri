import 'dotenv/config';
/** @type { import("drizzle-kit").Config } */
export default {
    schema: "./src/schema.js",
    dialect: 'sqlite',
    out: "./drizzle",
    dbCredentials: {
        url: './db/uwu.db',
    }
};
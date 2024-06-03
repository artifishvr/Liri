import { sqliteTable, integer, numeric, text } from "drizzle-orm/sqlite-core"

export const Members = sqliteTable("Members", {
    id: integer("id").primaryKey({ autoIncrement: true }),
    userid: text("userid", { length: 255 }).notNull(),
    kissys: integer("kissys").default(0).notNull(),
    hugged: integer("hugged").default(0).notNull(),
    dominated: integer("dominated").default(0).notNull(),
    deaths: integer("deaths").default(0).notNull(),
    pats: integer("pats").default(0).notNull(),
    createdAt: numeric("createdAt").notNull(),
    updatedAt: numeric("updatedAt").notNull(),
});
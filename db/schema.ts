import { sql } from "drizzle-orm";
import { integer, sqliteTable, text, uniqueIndex } from "drizzle-orm/sqlite-core";

export const memberCounter = sqliteTable("member_counter", {
  id: integer("id").primaryKey(),
  value: integer("value").notNull().default(0),
});

export const memberRequests = sqliteTable("member_requests", {
  requestKey: text("request_key").primaryKey(),
  memberNumber: integer("member_number"),
  nickname: text("nickname").notNull(),
  title: text("title").notNull(),
  joined: text("joined").notNull(),
  createdAt: text("created_at").notNull().default(sql`CURRENT_TIMESTAMP`),
}, (table) => [uniqueIndex("member_requests_member_number_unique").on(table.memberNumber)]);

export const rateLimits = sqliteTable("rate_limits", {
  fingerprint: text("fingerprint").primaryKey(),
  windowStart: integer("window_start").notNull(),
  attempts: integer("attempts").notNull().default(0),
});

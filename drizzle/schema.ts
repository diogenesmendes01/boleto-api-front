import { int, mysqlEnum, mysqlTable, text, timestamp, varchar } from "drizzle-orm/mysql-core";

/**
 * Core user table backing auth flow.
 * Extend this file with additional tables as your product grows.
 * Columns use camelCase to match both database fields and generated types.
 */
export const users = mysqlTable("users", {
  /**
   * Surrogate primary key. Auto-incremented numeric value managed by the database.
   * Use this for relations between tables.
   */
  id: int("id").autoincrement().primaryKey(),
  /** Manus OAuth identifier (openId) returned from the OAuth callback. Unique per user. */
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

/**
 * Configurações de APIs por empresa
 */
export const apiConfigurations = mysqlTable("api_configurations", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  apiProvider: varchar("apiProvider", { length: 50 }).notNull(), // 'asaas' ou 'cobrefacil'
  isActive: int("isActive").default(0).notNull(), // 0 = false, 1 = true
  apiKey: text("apiKey"),
  apiSecret: text("apiSecret"),
  additionalConfig: text("additionalConfig"), // JSON string para configs extras
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type ApiConfiguration = typeof apiConfigurations.$inferSelect;
export type InsertApiConfiguration = typeof apiConfigurations.$inferInsert;

/**
 * Histórico de uploads de planilhas
 */
export const uploads = mysqlTable("uploads", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  apiProvider: varchar("apiProvider", { length: 50 }).notNull(),
  fileName: varchar("fileName", { length: 255 }).notNull(),
  fileUrl: text("fileUrl").notNull(),
  status: varchar("status", { length: 20 }).notNull(), // 'success', 'error', 'processing'
  result: text("result"), // JSON string com resultado do processamento
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type Upload = typeof uploads.$inferSelect;
export type InsertUpload = typeof uploads.$inferInsert;
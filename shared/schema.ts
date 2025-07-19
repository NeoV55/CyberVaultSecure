import { pgTable, text, serial, integer, boolean, bigint } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const dids = pgTable("dids", {
  id: serial("id").primaryKey(),
  did: text("did").notNull().unique(),
  walletAddress: text("wallet_address").notNull(),
  status: text("status").notNull().default("active"),
  createdAt: bigint("created_at", { mode: "number" }).notNull(),
});

export const notarizedDocuments = pgTable("notarized_documents", {
  id: serial("id").primaryKey(),
  hash: text("hash").notNull().unique(),
  fileName: text("file_name").notNull(),
  category: text("category").notNull(),
  timestamp: bigint("timestamp", { mode: "number" }).notNull(),
  createdAt: bigint("created_at", { mode: "number" }).notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export const insertDidSchema = createInsertSchema(dids).omit({
  id: true,
  createdAt: true,
});

export const insertNotarizedDocumentSchema = createInsertSchema(notarizedDocuments).omit({
  id: true,
  createdAt: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type InsertDid = z.infer<typeof insertDidSchema>;
export type Did = typeof dids.$inferSelect;
export type InsertNotarizedDocument = z.infer<typeof insertNotarizedDocumentSchema>;
export type NotarizedDocument = typeof notarizedDocuments.$inferSelect;

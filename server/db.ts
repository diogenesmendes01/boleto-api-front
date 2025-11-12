import { eq } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import { InsertUser, users } from "../drizzle/schema";
import { ENV } from './_core/env';

let _db: ReturnType<typeof drizzle> | null = null;

// Lazily create the drizzle instance so local tooling can run without a DB.
export async function getDb() {
  if (!_db && process.env.DATABASE_URL) {
    try {
      _db = drizzle(process.env.DATABASE_URL);
    } catch (error) {
      console.warn("[Database] Failed to connect:", error);
      _db = null;
    }
  }
  return _db;
}

export async function upsertUser(user: InsertUser): Promise<void> {
  if (!user.openId) {
    throw new Error("User openId is required for upsert");
  }

  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot upsert user: database not available");
    return;
  }

  try {
    const values: InsertUser = {
      openId: user.openId,
    };
    const updateSet: Record<string, unknown> = {};

    const textFields = ["name", "email", "loginMethod"] as const;
    type TextField = (typeof textFields)[number];

    const assignNullable = (field: TextField) => {
      const value = user[field];
      if (value === undefined) return;
      const normalized = value ?? null;
      values[field] = normalized;
      updateSet[field] = normalized;
    };

    textFields.forEach(assignNullable);

    if (user.lastSignedIn !== undefined) {
      values.lastSignedIn = user.lastSignedIn;
      updateSet.lastSignedIn = user.lastSignedIn;
    }
    if (user.role !== undefined) {
      values.role = user.role;
      updateSet.role = user.role;
    } else if (user.openId === ENV.ownerOpenId) {
      values.role = 'admin';
      updateSet.role = 'admin';
    }

    if (!values.lastSignedIn) {
      values.lastSignedIn = new Date();
    }

    if (Object.keys(updateSet).length === 0) {
      updateSet.lastSignedIn = new Date();
    }

    await db.insert(users).values(values).onDuplicateKeyUpdate({
      set: updateSet,
    });
  } catch (error) {
    console.error("[Database] Failed to upsert user:", error);
    throw error;
  }
}

export async function getUserByOpenId(openId: string) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get user: database not available");
    return undefined;
  }

  const result = await db.select().from(users).where(eq(users.openId, openId)).limit(1);

  return result.length > 0 ? result[0] : undefined;
}

// Funções para configurações de API
export async function getApiConfigurationsByUserId(userId: number) {
  const db = await getDb();
  if (!db) return [];
  const { apiConfigurations } = await import("../drizzle/schema");
  return db.select().from(apiConfigurations).where(eq(apiConfigurations.userId, userId));
}

export async function getApiConfigurationByUserAndProvider(userId: number, apiProvider: string) {
  const db = await getDb();
  if (!db) return undefined;
  const { apiConfigurations } = await import("../drizzle/schema");
  const { and } = await import("drizzle-orm");
  const result = await db.select().from(apiConfigurations)
    .where(and(eq(apiConfigurations.userId, userId), eq(apiConfigurations.apiProvider, apiProvider)))
    .limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function upsertApiConfiguration(config: { userId: number; apiProvider: string; isActive: number; apiKey?: string | null; apiSecret?: string | null; additionalConfig?: string | null }) {
  const db = await getDb();
  if (!db) return;
  const { apiConfigurations } = await import("../drizzle/schema");
  const existing = await getApiConfigurationByUserAndProvider(config.userId, config.apiProvider);
  
  if (existing) {
    await db.update(apiConfigurations)
      .set({ ...config, updatedAt: new Date() })
      .where(eq(apiConfigurations.id, existing.id));
  } else {
    await db.insert(apiConfigurations).values(config);
  }
}

// Funções para uploads
export async function createUpload(upload: { userId: number; apiProvider: string; fileName: string; fileUrl: string; status: string; result?: string | null }) {
  const db = await getDb();
  if (!db) return;
  const { uploads } = await import("../drizzle/schema");
  const result = await db.insert(uploads).values(upload);
  return result;
}

export async function getUploadsByUserId(userId: number) {
  const db = await getDb();
  if (!db) return [];
  const { uploads } = await import("../drizzle/schema");
  const { desc } = await import("drizzle-orm");
  return db.select().from(uploads).where(eq(uploads.userId, userId)).orderBy(desc(uploads.createdAt));
}

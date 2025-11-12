import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, protectedProcedure, router } from "./_core/trpc";
import { z } from "zod";
import * as db from "./db";

export const appRouter = router({
    // if you need to use socket.io, read and register route in server/_core/index.ts, all api should start with '/api/' so that the gateway can route correctly
  system: systemRouter,
  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return {
        success: true,
      } as const;
    }),
  }),

  apiConfig: router({
    list: protectedProcedure.query(async ({ ctx }) => {
      return db.getApiConfigurationsByUserId(ctx.user.id);
    }),
    upsert: protectedProcedure
      .input(z.object({
        apiProvider: z.string(),
        isActive: z.number(),
        apiKey: z.string().optional(),
        apiSecret: z.string().optional(),
        additionalConfig: z.string().optional(),
      }))
      .mutation(async ({ ctx, input }) => {
        await db.upsertApiConfiguration({
          userId: ctx.user.id,
          ...input,
        });
        return { success: true };
      }),
  }),

  upload: router({
    list: protectedProcedure.query(async ({ ctx }) => {
      return db.getUploadsByUserId(ctx.user.id);
    }),
    create: protectedProcedure
      .input(z.object({
        apiProvider: z.string(),
        fileName: z.string(),
        fileUrl: z.string(),
      }))
      .mutation(async ({ ctx, input }) => {
        // Mock de processamento - retorna sucesso aleatório
        const isSuccess = Math.random() > 0.3;
        const mockResult = isSuccess 
          ? { processedRows: Math.floor(Math.random() * 50) + 1, errors: [] }
          : { processedRows: 0, errors: ["Erro ao processar linha 5: formato inválido", "Erro ao processar linha 12: campo obrigatório ausente"] };
        
        await db.createUpload({
          userId: ctx.user.id,
          apiProvider: input.apiProvider,
          fileName: input.fileName,
          fileUrl: input.fileUrl,
          status: isSuccess ? 'success' : 'error',
          result: JSON.stringify(mockResult),
        });
        
        return {
          success: isSuccess,
          result: mockResult,
        };
      }),
  }),
});

export type AppRouter = typeof appRouter;

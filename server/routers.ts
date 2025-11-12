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

  boleto: router({
    list: protectedProcedure.query(async ({ ctx }) => {
      return db.getBoletosByUserId(ctx.user.id);
    }),
    getById: protectedProcedure
      .input(z.object({ id: z.number() }))
      .query(async ({ ctx, input }) => {
        return db.getBoletoById(input.id, ctx.user.id);
      }),
    create: protectedProcedure
      .input(z.object({
        nossoNumero: z.string(),
        apiProvider: z.string(),
        customerName: z.string(),
        customerEmail: z.string().optional(),
        customerDocument: z.string().optional(),
        value: z.number(),
        dueDate: z.date(),
      }))
      .mutation(async ({ ctx, input }) => {
        // Mock: gera ID externo e URL do boleto
        const externalId = `${input.apiProvider.toUpperCase()}-${Date.now()}`;
        const boletoUrl = `https://mock-boleto.com/${externalId}`;
        const barcode = `${Math.floor(Math.random() * 1e15)}`;
        
        await db.createBoleto({
          userId: ctx.user.id,
          ...input,
          externalId,
          boletoUrl,
          barcode,
          status: 'pending',
        });
        
        return { success: true };
      }),
    update: protectedProcedure
      .input(z.object({
        id: z.number(),
        customerName: z.string().optional(),
        customerEmail: z.string().optional(),
        customerDocument: z.string().optional(),
        value: z.number().optional(),
        dueDate: z.date().optional(),
      }))
      .mutation(async ({ ctx, input }) => {
        const { id, ...data } = input;
        await db.updateBoleto(id, ctx.user.id, data);
        return { success: true };
      }),
    delete: protectedProcedure
      .input(z.object({ id: z.number() }))
      .mutation(async ({ ctx, input }) => {
        // Mock: cancela na API externa antes de deletar
        const boleto = await db.getBoletoById(input.id, ctx.user.id);
        if (boleto) {
          // Simula chamada para API externa para cancelar
          console.log(`[Mock] Cancelando boleto ${boleto.externalId} na API ${boleto.apiProvider}`);
        }
        await db.deleteBoleto(input.id, ctx.user.id);
        return { success: true };
      }),
    cancel: protectedProcedure
      .input(z.object({ id: z.number() }))
      .mutation(async ({ ctx, input }) => {
        // Mock: cancela na API externa
        const boleto = await db.getBoletoById(input.id, ctx.user.id);
        if (boleto) {
          console.log(`[Mock] Cancelando boleto ${boleto.externalId} na API ${boleto.apiProvider}`);
        }
        await db.cancelBoleto(input.id, ctx.user.id);
        return { success: true };
      }),
  }),
});

export type AppRouter = typeof appRouter;

import { prisma } from "../../db";
import { z } from "zod";

export const chatRouter = createTRPCRouter({
  chats: protectedProcedure.query(async ({ ctx }) => {
    return await prisma.chat.findMany({
      where: { userId: ctx.session.user.id },
      select: { title: true, id: true },
    });
  }),
  chatById: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ input }) => {
      const chatById = await prisma.chat.findUnique({
        where: { id: input.id },
        include: { messages: true },
      });
      const formatedChat = chatById?.messages.map((mess) => {
        return {
          role: mess.role,
          content: mess.content.split("\n"),
          id: mess.id,
        };
      });
      return { messages: formatedChat, chatTitle: chatById?.title };
    }),
  renameChat: protectedProcedure
    .input(z.object({ id: z.string(), title: z.string() }))
    .mutation(({ input, ctx }) => {}),

  deleteChat: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ input }) => {
      await prisma.chat.delete({ where: { id: input.id } });
      return;
    }),
});

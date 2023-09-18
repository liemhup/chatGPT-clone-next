import { prisma } from "./../../db";
import { z } from "zod";
import {
  ChatCompletionRequestMessageRoleEnum,
  Configuration,
  OpenAIApi,
} from "openai";

const config = new Configuration({
  apiKey: process.env.OPENAPI_KEY,
});
const openAi = new OpenAIApi(config);
export const AskAiRouter = createTRPCRouter({
  askAi: protectedProcedure
    .input(
      z.object({
        message: z.string(),
        chatId: z.string().optional(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      if (!ctx.session?.user.id) return;
      const userId = ctx.session.user.id;
      try {
        let chat;
        if (!input.chatId) {
          chat = await prisma.chat.create({
            data: {
              userId: userId,
              messages: {
                create: {
                  role: "user",
                  content: input.message,
                  userId: userId,
                },
              },
              title: input.message.split(" ").splice(0, 5).join(" "),
            },
            include: { messages: true },
          });
        } else
          chat = await prisma.chat.update({
            where: { id: input.chatId },
            data: {
              messages: {
                create: { role: "user", content: input.message, userId },
              },
            },
            include: { messages: true },
          });

        if (chat == null) return;

        const formatedChat = chat.messages.map((message) => {
          return {
            role: message.role as ChatCompletionRequestMessageRoleEnum,
            content: message.content,
          };
        });
        const res = await openAi.createChatCompletion({
          model: "gpt-3.5-turbo",
          messages: formatedChat,
          temperature: 0.8,
          max_tokens: 2048,
          // stream: true,
        });

        if (res.data) {
          await prisma.chat.update({
            where: { id: chat.id },
            data: {
              messages: {
                create: {
                  role: "assistant" as ChatCompletionRequestMessageRoleEnum,
                  content: res.data.choices[0]?.message?.content || "",
                  userId,
                },
              },
            },
          });
        }
        return chat;
      } catch (error) {
        throw error;
      }
    }),

  regenerate: protectedProcedure
    .input(z.object({ chatId: z.string() }))
    .mutation(async ({ input, ctx }) => {
      let chat = await prisma.chat.findUnique({
        where: { id: input.chatId },
        include: { messages: true },
      });
      if (!chat) return null;
      const deletedMess = chat.messages.pop();
      await prisma.message.delete({ where: { id: deletedMess?.id } });
      const formatedChat = chat.messages.map((message) => {
        return {
          role: message.role as ChatCompletionRequestMessageRoleEnum,
          content: message.content,
        };
      });
      const res = await openAi.createChatCompletion({
        model: "gpt-3.5-turbo",
        messages: formatedChat,
        temperature: Math.random(),
        max_tokens: 2048,
      });
      if (res.data) {
        await prisma.chat.update({
          where: { id: chat.id },
          data: {
            messages: {
              create: {
                role: "assistant",
                content: res.data.choices[0]?.message?.content || "",
                userId: ctx.session.user.id,
              },
            },
          },
        });
      }
      console.log("deleted", res.data.choices[0]?.message?.content);
      return chat;
    }),
  streaming: protectedProcedure.mutation(async () => {
    const res = await openAi.createCompletion(
      {
        prompt: "this is a test",
        model: "gpt-3.5-turbo",
        stream: true,
      },
      { responseType: "stream" }
    );
    return res.data;
  }),
});

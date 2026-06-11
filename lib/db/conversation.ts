import { prisma } from "@/lib/prisma";
import { MessageRole } from "@prisma/client";

function toMessageRole(role: string): MessageRole {
  switch (role) {
    case "assistant":
      return MessageRole.ASSISTANT;
    case "system":
      return MessageRole.SYSTEM;
    default:
      return MessageRole.USER;
  }
}

export async function createConversation(userId?: string, leadId?: string) {
  return prisma.conversation.create({
    data: {
      userId,
      leadId,
    },
  });
}

export async function addMessage(
  conversationId: string,
  role: string,
  content: string
) {
  return prisma.message.create({
    data: {
      conversationId,
      role: toMessageRole(role),
      content,
    },
  });
}

export async function getConversation(conversationId: string) {
  return prisma.conversation.findUnique({
    where: { id: conversationId },
    include: {
      messages: {
        orderBy: { createdAt: "asc" },
      },
    },
  });
}

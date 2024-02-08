import { FastifyInstance } from "fastify";
import { z } from 'zod';

import { prisma } from '../lib/prisma'

export async function getPoll(app: FastifyInstance) {
  app.get("/polls/:pollId", async (request) => {
    const getPollParams = z.object({
      pollId: z.string()
    });

    const { pollId } = getPollParams.parse(request.params);

    const poll = await prisma.poll.findFirst({
      where: { id: pollId, },
      include: {
        options: {
          select: {
            id: true,
            title: true
          },
        }
      },
    });

    return poll;
  });
}

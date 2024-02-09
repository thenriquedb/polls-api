import { FastifyInstance } from "fastify";
import { z } from 'zod';
import { randomUUID } from 'node:crypto';

import { prisma } from '../../lib/prisma'
import { redis } from "../../lib/redis";
import { votingPubSub } from "../../util/voting-pub-sub";

export async function voteOnPoll(app: FastifyInstance) {
  app.post("/polls/:pollId/votes", async (request, reply) => {
    const votePollBody = z.object({
      pollOptionId: z.string().uuid()
    });

    const votePollParams = z.object({
      pollId: z.string().uuid()
    });

    const { pollOptionId } = votePollBody.parse(request.body);
    const { pollId } = votePollParams.parse(request.params);

    const ONE_MONTH = 60 * 60 * 24 * 34;

    let sessionId = request.cookies.sessionId;

    if (sessionId) {
      const userPreviousVoteOnPoll = await prisma.vote.findUnique({
        where: {
          sessionId_pollId: {
            pollId,
            sessionId
          }
        }
      });

      if (userPreviousVoteOnPoll && userPreviousVoteOnPoll?.pollOptionId !== pollOptionId) {
        await prisma.vote.delete({
          where: {
            id: userPreviousVoteOnPoll.id
          }
        });

        const votes = await redis.zincrby(pollId, -1, userPreviousVoteOnPoll.pollOptionId);

        votingPubSub.publish(pollId, {
          pollOptionId: userPreviousVoteOnPoll.pollOptionId,
          votes: Number(votes)
        });
      } else if (userPreviousVoteOnPoll?.pollOptionId === pollOptionId) {
        return reply.status(400).send({
          message: "You already vote on this poll"
        });
      }

    }

    if (!sessionId) {
      sessionId = randomUUID();
      reply.setCookie("sessionId", sessionId, {
        path: '/',
        maxAge: ONE_MONTH,
        signed: true,
        httpOnly: true
      });
    }

    await prisma.vote.create({
      data: {
        sessionId,
        pollOptionId: pollOptionId,
        pollId,
      }
    });

    const votes = await redis.zincrby(pollId, 1, pollOptionId);

    votingPubSub.publish(pollId, {
      pollOptionId,
      votes: Number(votes)
    });

    return reply.status(204).send({ sessionId });
  });
}
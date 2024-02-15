import { randomUUID } from "crypto";
import { FastifyReply, FastifyRequest } from "fastify";
import z from "zod";
import { makeVoteOnPollUseCase } from "../../../use-cases/vote-on-poll";

export class VoteOnPollController {
  async handle(request: FastifyRequest, reply: FastifyReply) {
    const votePollBody = z.object({
      pollOptionId: z.string().uuid()
    });

    const votePollParams = z.object({
      pollId: z.string().uuid()
    });

    const { pollOptionId } = votePollBody.parse(request.body);
    const { pollId } = votePollParams.parse(request.params);

    const voteOnPollUsecase = makeVoteOnPollUseCase();

    let sessionId = request.cookies.sessionId;

    if (!sessionId) {
      const ONE_MONTH = 60 * 60 * 24 * 34;

      sessionId = randomUUID();
      reply.setCookie("sessionId", sessionId, {
        path: '/',
        maxAge: ONE_MONTH,
        signed: true,
        httpOnly: true
      });
    }

    await voteOnPollUsecase.execute({
      pollId,
      pollOptionId,
      sessionId
    });

    return reply.status(204).send();
  }
}
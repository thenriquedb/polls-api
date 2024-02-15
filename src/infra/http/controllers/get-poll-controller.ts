import { FastifyReply, FastifyRequest } from "fastify";
import z from "zod";
import { makeGetPollUseCase } from "../../../use-cases/get-poll";

export class GetPollController {
  async handle(request: FastifyRequest, reply: FastifyReply) {
    const getPollParams = z.object({
      pollId: z.string()
    });

    const { pollId } = getPollParams.parse(request.params);

    const getPollUseCase = makeGetPollUseCase();

    const { poll } = await getPollUseCase.execute({ pollId });

    if (!poll) {
      return reply.status(400).send({ message: "Poll not found" });
    }

    return { poll };
  }
}
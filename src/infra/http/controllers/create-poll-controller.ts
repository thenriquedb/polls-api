import { FastifyReply, FastifyRequest } from "fastify";
import z from "zod";
import { makeCreatePollUseCase } from "../../../use-cases/create-poll";

export class CreatePollController {
  async handle(request: FastifyRequest, reply: FastifyReply) {
    const createPollBody = z.object({
      title: z.string(),
      options: z.array(z.string())
    });

    const { title, options } = createPollBody.parse(request.body);

    const createPollUseCase = makeCreatePollUseCase();
    const { pollId } = await createPollUseCase.execute({ title, options, });

    return reply.status(201).send({ pollId });
  }
}
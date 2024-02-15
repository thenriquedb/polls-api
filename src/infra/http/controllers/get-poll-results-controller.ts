import { FastifyRequest } from "fastify";
import { SocketStream } from "@fastify/websocket";
import z from "zod";

import { makeGetPollResults } from "../../../use-cases/get-poll-results";

export class GetPollResultsController {
  async handle(connection: SocketStream, request: FastifyRequest) {
    const votePollParams = z.object({
      pollId: z.string().uuid()
    });


    const { pollId } = votePollParams.parse(request.params);

    const getPollResults = makeGetPollResults();

    getPollResults.execute({ pollId }, (message) => {
      console.log("message", message);

      connection.socket.send(JSON.stringify(message));
    });
  }
}
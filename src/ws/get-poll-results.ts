import { FastifyInstance } from "fastify";
import { z } from 'zod';

import { votingPubSub } from "../util/voting-pub-sub";

export async function getPollResults(app: FastifyInstance) {
  app.get("/polls/:pollId/results", { websocket: true }, (connection, request) => {
    const votePollParams = z.object({
      pollId: z.string().uuid()
    });

    const { pollId } = votePollParams.parse(request.params);

    votingPubSub.subscribe(pollId, (message) => {
      connection.socket.send(JSON.stringify(message));
    });
  });
}
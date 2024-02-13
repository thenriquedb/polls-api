import fastify from "fastify";
import cookie from '@fastify/cookie';
import websocket from '@fastify/websocket';
import { ZodError } from "zod";
import { env } from "process";

import { AppError } from "../../util/app-error";

import { GetPollController } from "./controllers/get-poll-controller";
import { CreatePollController } from "./controllers/create-poll-controller";
import { VoteOnPollController } from "./controllers/vote-on-poll-controller";
import { getPollResults } from "./ws/get-poll-results";

const app = fastify();

const getPollController = new GetPollController();
const createPollController = new CreatePollController();
const voteOnPollController = new VoteOnPollController();

app.register(cookie, {
  secret: "dHJvcGEgZG8gZm9ndWV0ZSByb3hvIHZydW0gdnJ1bQ==",
  hook: 'onRequest',
});

app.register(websocket)

app.setErrorHandler((error, request, reply) => {
  if (env.NODE_ENV !== 'production') {
    console.error(error)
  }

  if (error instanceof ZodError) {
    return reply
      .status(400)
      .send({ message: 'Validation error', issues: error.format() })
  }

  if (error instanceof AppError) {
    return reply
      .status(error.statusCode)
      .send({ message: error.message });
  }

  return reply.status(500).send({
    message: 'Internal server error',
    error
  })
})

app.post("/polls", createPollController.handle);
app.get("/polls/:pollId", getPollController.handle);
app.post("/polls/:pollId/votes", voteOnPollController.handle);
app.register(getPollResults);

app.listen({ port: 3333 }).then(() => console.log("Server running"));
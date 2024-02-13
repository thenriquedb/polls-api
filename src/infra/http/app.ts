import fastify, { FastifyError, FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import cookie from '@fastify/cookie';
import websocket from '@fastify/websocket';
import { ZodError } from "zod";
import { env } from "process";

import { AppError } from "../../util/app-error";

import { GetPollController } from "./controllers/get-poll-controller";
import { CreatePollController } from "./controllers/create-poll-controller";
import { VoteOnPollController } from "./controllers/vote-on-poll-controller";
import { getPollResults } from "./ws/get-poll-results";

const getPollController = new GetPollController();
const createPollController = new CreatePollController();
const voteOnPollController = new VoteOnPollController();

type Constructor = {
  port: number;
}

export class App {
  private app: FastifyInstance;
  private port: number;

  constructor({ port }: Constructor) {
    this.app = fastify();
    this.port = port;
  }

  configureCookie() {
    this.app.register(cookie, {
      secret: "dHJvcGEgZG8gZm9ndWV0ZSByb3hvIHZydW0gdnJ1bQ==",
      hook: 'onRequest',
    });
  }

  configureWebSocket() {
    this.app.register(websocket);
  }

  errorHandler(error: FastifyError, request: FastifyRequest, reply: FastifyReply) {
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
    });
  }

  configureRoutes() {
    this.app.post("/polls", createPollController.handle);
    this.app.get("/polls/:pollId", getPollController.handle);
    this.app.post("/polls/:pollId/votes", voteOnPollController.handle);
    this.app.register(getPollResults);
  }

  run() {
    this.configureCookie();
    this.configureWebSocket();
    this.app.setErrorHandler(this.errorHandler);
    this.configureRoutes();

    this.app.listen({ port: this.port }).then(() => console.log("Server running"));
  }
}
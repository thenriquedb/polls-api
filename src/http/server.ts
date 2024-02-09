import fastify from "fastify";
import cookie from '@fastify/cookie';
import websocket from '@fastify/websocket';

import { createPoll } from "./routes/create-poll";
import { getPoll } from "./routes/get-poll";
import { voteOnPoll } from "./routes/vote-on-poll";
import { getPollResults } from "../ws/get-poll-results";

const app = fastify();

app.register(cookie, {
  secret: "dHJvcGEgZG8gZm9ndWV0ZSByb3hvIHZydW0gdnJ1bQ==",
  hook: 'onRequest',
});

app.register(websocket)

app.register(createPoll);
app.register(getPoll);
app.register(voteOnPoll);
app.register(getPollResults);

app.listen({ port: 3333 }).then(() => console.log("Server running"));
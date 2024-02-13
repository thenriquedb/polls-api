import { Vote } from '@prisma/client';
import { prisma } from '../infra/storage/prisma';

export interface IVoteRepository {
  create(sessionId: string, pollOptionId: string, pollId: string): Promise<Vote>;
  delete(voteId: number): Promise<Vote>
  findByPollId(pollId: string, sessionId: string): Promise<Vote>
  findPreviousUserVote(pollId: string, sessionId: string): Promise<Vote | null>;
}

export class VoteRepository implements IVoteRepository {
  async create(sessionId: string, pollOptionId: string, pollId: string): Promise<Vote> {
    return prisma.vote.create({
      data: {
        sessionId,
        pollOptionId: pollOptionId,
        pollId,
      }
    });
  }

  async delete(voteId: number) {
    return prisma.vote.delete({
      where: { id: voteId }
    });
  }

  async findByPollId(pollId: string, sessionId: string) {
    return prisma.vote.findUniqueOrThrow({
      where: {
        sessionId_pollId: {
          pollId,
          sessionId
        }
      }
    });
  }

  async findPreviousUserVote(pollId: string, sessionId: string): Promise<Vote | null> {
    return prisma.vote.findUnique({
      where: {
        sessionId_pollId: {
          pollId,
          sessionId
        }
      }
    });
  }
}
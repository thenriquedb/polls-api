import { Poll, PollOption } from '@prisma/client';
import { prisma } from '../infra/storage/prisma';

export interface IPollRepository {
  create(title: string, options: string[]): Promise<Poll>;
  findById(pollId: string): Promise<Poll & { options: PollOption[] }>;
}

export class PollRepository implements IPollRepository {
  async create(title: string, options: string[]): Promise<Poll> {
    return prisma.poll.create({
      data: {
        title,
        options: {
          createMany: {
            data: options.map(option => ({ title: option }))
          }
        }
      }
    });
  }

  async findById(pollId: string): Promise<Poll & { options: PollOption[] }> {
    return prisma.poll.findFirstOrThrow({
      where: { id: pollId, },
      include: {
        options: {
          select: {
            id: true,
            title: true
          },
        }
      },
    });
  }
}
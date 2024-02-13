import { IPollRepository, } from "../../repository/poll-repository";
import { IRedis } from "../../infra/storage/redis";

export class GetPollUseCase {
  constructor(
    private pollRepository: IPollRepository,
    private redis: IRedis
  ) { }

  async execute(input: { pollId: string }) {
    const { pollId } = input;

    const poll = await this.pollRepository.findById(pollId);

    const result = await this.redis.zrange(pollId, 0, -1, 'WITHSCORES');

    const votes = result.reduce((obj, item, index) => {
      if (index % 2 === 0) {
        const score = Number(result[index + 1]);
        Object.assign(obj, { [item]: score });
      }

      return obj;
    }, {} as Record<string, number>);

    return {
      poll: {
        id: poll.id,
        title: poll.title,
        options: poll.options.map(option => ({
          id: option.id,
          title: option.title,
          score: votes[option.id] ?? 0
        }))
      }
    };
  }
}
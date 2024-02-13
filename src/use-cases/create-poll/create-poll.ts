import { IPollRepository } from "../../repository/poll-repository";

export class CreatePollUseCase {
  constructor(private pollRepository: IPollRepository) { }

  async execute(input: { title: string, options: string[] }) {
    const { title, options } = input;

    const poll = await this.pollRepository.create(title, options);

    return { pollId: poll.id };
  }
}
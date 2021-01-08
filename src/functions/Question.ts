import { instagramProfiles } from "../data/instagramProfiles";
import { IPlayer } from "../models/Player";
import { IQuestion, QuestionModel, QuestionSchema } from "../models/Question";
import { IRoom } from "../models/Room";
import { getInstagramFollowerCount } from "./Instagram";
import { INameCategory, NameCategoryModel } from "../models/categories/Name";

export async function generateQuestion() {
  const aggregate = await NameCategoryModel.aggregate([
    {
      $match: {
        ate2010: {
          $gt: 3000,
        },
      },
    },

    {
      $sample: { size: 1 },
    },
  ]);

  const res: INameCategory = aggregate[0];

  const question = new QuestionModel({
    text: `Quantos pessoas se chamam ${res.Nome}`,
    answer: res.ate2010 || 0,
    category: "Nomes do Brasil",
  });

  return question;
}

export function getRandomArrayItem(items: any[]) {
  return items[Math.floor(Math.random() * items.length)];
}

export function calculateRelativeDifference(
  hunchValue: number,
  correctAnswer: number
) {
  return (
    100 *
    Math.abs((hunchValue - correctAnswer) / ((hunchValue + correctAnswer) / 2))
  );
}

function calculateScore(question: IQuestion, playerHunch: number): number {
  const diff = calculateRelativeDifference(playerHunch, question.answer);
  return Math.ceil(diff > 100 ? 0 : 100 - diff);
}

export function calculatePlayersScore(room: IRoom): IPlayer[] {
  const players: IPlayer[] = [];

  room.players.map((player) => {
    const score = calculateScore(room.round.question, player.hunch);

    player.score = player.score + score;
    player.hasSentHunch = false;
    player.hunch = null;
    player.roundScore = score;

    players.push(player);
  });

  return players;
}

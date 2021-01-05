import { instagramProfiles } from "src/data/instagramProfiles";
import { IPlayer } from "src/models/Player";
import { IQuestion, QuestionModel, QuestionSchema } from "src/models/Question";
import { IRoom } from "src/models/Room";
import { getInstagramFollowerCount } from "./Instagram";

export async function generateQuestion() {
  const profile = getRandomArrayItem(instagramProfiles);
  const answer = await getInstagramFollowerCount(profile);

  if (!answer) {
    throw "Error";
  }

  const question = new QuestionModel({
    text: `Quantos seguidores tem @${profile}`,
    answer,
    category: "Instagram",
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
    player.score =
      player.score + calculateScore(room.round.question, player.hunch);
    player.hasSentHunch = false;
    player.hunch = null;

    players.push(player);
  });

  return players;
}

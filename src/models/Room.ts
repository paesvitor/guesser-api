import mongoose, { Document, Schema } from "mongoose";
import { IPlayer, PlayerModel, PlayerSchema } from "./Player";
import randomize from "randomatic";
import { IQuestion, QuestionSchema } from "./Question";

export interface IRoom extends Document {
  code?: string;
  players?: IPlayer[];
  owner: IPlayer;
  round?: {
    canSendAnswer: boolean;
    question: IQuestion;
    total: number;
    current: number;
    ready: boolean;
    finishAt: string;
  };
}

export const RoomSchema: Schema = new mongoose.Schema({
  code: {
    type: String,
    unique: true,
  },

  players: [PlayerSchema],

  owner: {
    type: PlayerSchema,
    required: true,
  },

  round: {
    question: QuestionSchema,
    canSendAnswer: {
      default: false,
      type: Boolean,
    },

    total: {
      max: 15,
      default: 10,
      type: Number,
    },

    current: {
      default: 0,
      type: Number,
    },

    ready: {
      type: Boolean,
      default: false,
    },

    finishAt: {
      type: String,
      default: null,
    },
  },
});

RoomSchema.pre("save", async function (this: any, next) {
  const code = randomize("A", 4);
  this.code = code;
  this.players = [this.owner];
  next();
});

export const RoomModel = mongoose.model<IRoom>("Room", RoomSchema);

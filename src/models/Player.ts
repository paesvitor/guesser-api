import mongoose, { Document, Schema } from "mongoose";

export interface IPlayer extends Document {
  name: string;
  avatar: number;
  score: number;
  hunch: number;
  hasSentHunch: boolean;
  roundScore: number;
}

export const PlayerSchema: Schema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },

  avatar: {
    type: Number,
    max: 15,
    required: true,
  },

  score: {
    type: Number,
    default: 0,
  },

  hunch: {
    type: Number,
  },

  roundScore: {
    type: Number,
  },

  hasSentHunch: {
    type: Boolean,
    default: false,
  },
});

export const PlayerModel = mongoose.model<IPlayer>("Player", PlayerSchema);

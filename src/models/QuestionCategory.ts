import mongoose, { Document, Schema } from "mongoose";

export interface IQuestionCategory extends Document {
  name: string;
}

export const QuestionCategorySchema: Schema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
});

export const PlayerModel = mongoose.model<IQuestionCategory>(
  "QuestionCategory",
  QuestionCategorySchema
);

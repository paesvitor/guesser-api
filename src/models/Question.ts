import mongoose, { Document, Schema } from "mongoose";
import { QuestionCategorySchema } from "./QuestionCategory";

export interface IQuestion extends Document {
  text: string;
  category: string;
  answer: number;
}

export const QuestionSchema: Schema = new mongoose.Schema({
  text: {
    type: String,
    required: true,
  },

  category: {
    enum: ["Instagram"],
    type: String,
  },

  answer: {
    type: Number,
  },
});

export const QuestionModel = mongoose.model<IQuestion>(
  "Question",
  QuestionSchema
);

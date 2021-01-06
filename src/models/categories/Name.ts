import mongoose, { Document, Schema } from "mongoose";

export interface INameCategory extends Document {
  Nome: string;
  ate2010: number;
}

export const NameCategorySchema: Schema = new mongoose.Schema({
  Nome: {
    type: String,
    required: true,
  },

  ate2010: {
    type: Number,
    required: true,
  },
});

export const NameCategoryModel = mongoose.model<INameCategory>(
  "Name",
  NameCategorySchema
);

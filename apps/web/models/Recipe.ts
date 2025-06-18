import mongoose, { Schema, Model, Document, Types } from "mongoose";

export interface IIngredient {
  name: string;
  amount: string;
}

export interface IStep {
  number: number;
  description: string;
  duration: number;
}

export interface IRecipe extends Document {
  userId?: Types.ObjectId;
  title: string;
  image?: string;
  source?: string;
  spoonacularId: string;
  ingredients: IIngredient[];
  steps: IStep[];
  totalTime?: number;
  nutrition: any;
  cost?: any;
}

const IngredientSchema = new Schema(
  {
    name: String,
    amount: String,
  },
  { _id: false }
);

const StepSchema = new Schema<IStep>(
  {
    number: { type: Number, required: true },
    description: { type: String, required: true },
    duration: { type: Number, required: true },
  },
  { _id: false }
);

const RecipeSchema = new Schema<IRecipe>(
  {
    userId: { type: Types.ObjectId, ref: "User", required: true },
    title: { type: String, required: true },
    image: String, // URL or S3 key for recipe image
    source: String, // spoonacular or user-upload
    spoonacularId: String,
    ingredients: [IngredientSchema],
    steps: [StepSchema],
    totalTime: Number,
    nutrition: Schema.Types.Mixed,
    cost: Schema.Types.Mixed,
  },
  { timestamps: true }
);

const User: Model<IRecipe> =
  mongoose.models.User || mongoose.model<IRecipe>("Recipe", RecipeSchema);

export default User;

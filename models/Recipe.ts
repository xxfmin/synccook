import mongoose, { Schema, InferSchemaType, Types, Model } from "mongoose";

const IngredientSchema = new Schema(
  {
    name: { type: String, required: true },
    quantity: { type: Number, required: true },
    unit: { type: String, required: true },
  },
  { _id: false }
);

const StepSchema = new Schema(
  {
    order: { type: Number, required: true }, // step 1, step 2
    description: { type: String, required: true },
    duration: { type: Number, required: true }, // minutes
  },
  { _id: false }
);

const RecipeSchema = new Schema(
  {
    title: { type: String, required: true },
    description: { type: String },
    author: { type: Types.ObjectId, ref: "User", required: true },
    ingredients: [IngredientSchema],
    steps: [StepSchema],
  },
  {
    timestamps: true,
  }
);

export type RecipeDoc = InferSchemaType<typeof RecipeSchema>;

const Recipe: Model<RecipeDoc> =
  mongoose.models.Recipe || mongoose.model<RecipeDoc>("Recipe", RecipeSchema);

export default Recipe;
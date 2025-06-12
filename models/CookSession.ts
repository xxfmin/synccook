import mongoose, { Schema, InferSchemaType, Types, Model } from "mongoose";

const AggregatedIngredientSchema = new Schema(
  {
    name: { type: String, required: true },
    quantity: { type: Number, required: true },
    unit: { type: String, required: true },
  },
  { _id: false }
);

const CombinedStepSchema = new Schema(
  {
    recipe: { type: Types.ObjectId, ref: "Recipe", required: true },
    originalOrder: { type: Number, required: true },
    description: { type: String, required: true },
    duration: { type: Number, required: true }, // minutes
    startOffset: { type: Number, required: true }, // minutes from session start
  },
  { _id: false }
);

const CookSessionSchema = new Schema(
  {
    user: { type: Types.ObjectId, ref: "User", required: true },
    title: { type: String }, //
    recipes: [{ type: Types.ObjectId, ref: "Recipe" }], // pointers to base recipes
    aggregatedIngredients: [AggregatedIngredientSchema],
    combinedTimeline: [CombinedStepSchema],
    startTime: { type: Date, default: () => new Date() },
    duration: { type: Number, required: true },
  },
  { timestamps: true }
);

export type CookSessionDoc = InferSchemaType<typeof CookSessionSchema>;

const CookSession: Model<CookSessionDoc> =
  mongoose.models.CookSession ||
  mongoose.model<CookSessionDoc>("CookSession", CookSessionSchema);

export default CookSession;

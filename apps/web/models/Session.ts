import mongoose, { Schema, Model, Document, Types } from "mongoose";

export interface ITimelineEntry {
  recipeId: Types.ObjectId; // recipe it belongs to
  stepNumber: number; // step in that recipe
  startTime: Date; // when to begin this step
  endTime: Date; // when to finish this step
}

export interface ISession extends Document {
  userId: Types.ObjectId; // user cooking
  recipes: Types.ObjectId[]; // recipes used in this session
  serveTime: Date; // when the meal should bre ready
  timeline: ITimelineEntry[]; // detailed plan
}

const TimelineEntrySchema = new Schema<ITimelineEntry>(
  {
    recipeId: { type: Schema.Types.ObjectId, ref: "Recipe", required: true },
    stepNumber: { type: Number, required: true },
    startTime: { type: Date, required: true },
    endTime: { type: Date, required: true },
  },
  { _id: false }
);

const SessionSchema = new Schema<ISession>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    recipes: [{ type: Types.ObjectId, ref: "Recipe", required: true }],
    serveTime: { type: Date, required: true },
    timeline: [TimelineEntrySchema],
  },
  { timestamps: true }
);

const Session: Model<ISession> =
  mongoose.models.Session || mongoose.model<ISession>("Session", SessionSchema);

export default Session;

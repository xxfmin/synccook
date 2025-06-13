import mongoose from "mongoose";
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/route";
import { connectMongoDB } from "../../../../../lib/mongodb";
import CookSession from "../../../../../models/CookSession";
import Recipe from "../../../../../models/Recipe";
import { scheduleRecipes } from "../../../../../lib/timelineScheduler";

// total ingredient count
function buildAggregatedIngredients(recipes: any[]) {
  const map = new Map<
    string,
    { name: string; unit: string; quantity: number }
  >();
  recipes.forEach((r) =>
    r.ingredients.forEach(({ name, unit, quantity }: any) => {
      const key = `${name}|${unit}`;
      const existing = map.get(key);
      if (existing) existing.quantity += quantity;
      else map.set(key, { name, unit, quantity });
    })
  );
  return Array.from(map.values());
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    return NextResponse.json({ message: "Not authenticated" }, { status: 401 });
  }

  const { add = [], remove = [] } = await req.json();

  await connectMongoDB();
  const cookSession = await CookSession.findOne({
    _id: params.id,
    user: session.user.id,
  });
  if (!cookSession) {
    return NextResponse.json(
      { message: "Session not found or unauthorized" },
      { status: 404 }
    );
  }

  // remove any recipes
  remove.forEach((id: string) => cookSession.recipes.pull(id));

  // add new recipes
  add.forEach((id: string) =>
    cookSession.recipes.push(new mongoose.Types.ObjectId(id))
  );

  // refetch full recipes
  const recipes = await Recipe.find({
    _id: { $in: cookSession.recipes },
  }).lean();

  // reaggregate ingredients
  cookSession.aggregatedIngredients = buildAggregatedIngredients(recipes);

  // rebuild timeline
  const scheduled = scheduleRecipes(
    recipes.map((r) => ({
      id: r._id.toString(),
      steps: r.steps.map((s: any) => ({
        order: s.order,
        description: s.description,
        duration: s.duration,
      })),
    }))
  );
  cookSession.combinedTimeline = scheduled.map((s) => ({
    recipe: s.recipeId,
    originalOrder: s.stepOrder,
    description: s.description,
    duration: s.duration,
    startOffset: s.startOffset,
  }));

  // recompute session duration with proper typing
  type Entry = { startOffset: number; duration: number };
  const timeline = cookSession.combinedTimeline as unknown as Entry[];
  cookSession.duration = Math.max(
    ...timeline.map((e) => e.startOffset + e.duration)
  );

  // save + return
  await cookSession.save();
  return NextResponse.json(cookSession);
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: { id: string } }
) {
  // auth
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    return NextResponse.json({ message: "Not authenticated" }, { status: 401 });
  }

  await connectMongoDB();

  // find + delete session
  const deleted = await CookSession.findOneAndDelete({
    _id: params.id,
    user: session.user.id,
  });

  if (!deleted) {
    return NextResponse.json(
      { message: "Session not found or unauthorized" },
      { status: 404 }
    );
  }

  return NextResponse.json(
    { message: "Session deleted successfully" },
    { status: 200 }
  );
}

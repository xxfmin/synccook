import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";
import { connectMongoDB } from "../../../../lib/mongodb";
import CookSession from "../../../../models/CookSession";
import Recipe from "../../../../models/Recipe";
import { scheduleRecipes } from "../../../../lib/timelineScheduler";

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

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    return NextResponse.json({ message: "Not authenticated" }, { status: 401 });
  }

  await connectMongoDB();
  const sessions = await CookSession.find({ user: session.user.id })
    .populate({ path: "recipes", select: "title description duration" })
    .lean();

  return NextResponse.json(sessions);
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    return NextResponse.json({ message: "Not authenticated" }, { status: 401 });
  }

  const { title, recipeIds } = await req.json();
  if (!Array.isArray(recipeIds) || recipeIds.length === 0) {
    return NextResponse.json(
      { message: "Must supply at least one recipe ID" },
      { status: 400 }
    );
  }

  // compute startTime
  const startTime = new Date();

  // fetch recipes
  await connectMongoDB();
  const recipes = await Recipe.find({ _id: { $in: recipeIds } }).lean();
  if (recipes.length !== recipeIds.length) {
    return NextResponse.json(
      { message: "One or more recipes not found" },
      { status: 404 }
    );
  }

  // aggregate ingredients
  const aggregatedIngredients = buildAggregatedIngredients(recipes);

  // build timeline (steps start at offset 0)
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

  // map to CombinedStepSchema
  const combinedTimeline = scheduled.map((s) => ({
    recipe: s.recipeId,
    originalOrder: s.stepOrder,
    description: s.description,
    duration: s.duration,
    startOffset: s.startOffset,
  }));

  // compute total session duration
  const sessionDuration = Math.max(
    ...combinedTimeline.map((e) => e.startOffset + e.duration)
  );

  // create + return
  const cookSession = await CookSession.create({
    user: session.user.id,
    title,
    recipes: recipeIds,
    startTime,
    duration: sessionDuration,
    aggregatedIngredients,
    combinedTimeline,
  });

  return NextResponse.json(cookSession, { status: 201 });
}

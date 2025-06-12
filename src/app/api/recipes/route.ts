import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { authOptions } from "../auth/[...nextauth]/route";
import { connectMongoDB } from "../../../../lib/mongodb";
import Recipe from "../../../../models/Recipe";

export async function POST(request: NextRequest) {
  try {
    // auth
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json(
        { message: "Not authenticated." },
        { status: 401 }
      );
    }

    // parse and validate
    const { title, description, ingredients, steps } = await request.json();
    if (
      !title ||
      !Array.isArray(ingredients) ||
      ingredients.length === 0 ||
      !Array.isArray(steps) ||
      steps.length === 0
    ) {
      return NextResponse.json(
        { message: "Missing title, ingredients, or steps" },
        { status: 400 }
      );
    }

    // connect + create
    await connectMongoDB();
    const newRecipe = await Recipe.create({
      title,
      description,
      ingredients,
      steps,
      author: session.user.id,
    });

    return NextResponse.json(newRecipe, { status: 201 });
  } catch (error) {
    console.error("Error creating recipe:", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    await connectMongoDB();
    const recipes = await Recipe.find()
      .populate("author", "firstName lastName email")
      .lean();
    return NextResponse.json(recipes);
  } catch (error) {
    console.error("Error retrieving recipes: ", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}

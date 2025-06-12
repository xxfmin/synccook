import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { authOptions } from "../../auth/[...nextauth]/route";
import { connectMongoDB } from "../../../../../lib/mongodb";
import Recipe from "../../../../../models/Recipe";

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id: recipeId } = await params;
    if (!recipeId.match(/^[0-9a-fA-F]{24}$/)) {
      return NextResponse.json(
        { message: "Invalid recipe ID" },
        { status: 400 }
      );
    }

    // connect + find
    await connectMongoDB();
    const recipe = await Recipe.findById(recipeId)
      .populate("author", "firstName lastName email")
      .lean();

    if (!recipe) {
      return NextResponse.json(
        { message: "Recipe not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(recipe);
  } catch (error) {
    console.error("Error retrieving recipe: ", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // auth
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json(
        { message: "Not authenticated." },
        { status: 401 }
      );
    }

    const recipeId = params.id;
    if (!recipeId.match(/^[0-9a-fA-F]{24}$/)) {
      return NextResponse.json(
        { message: "Invalid recipe ID" },
        { status: 400 }
      );
    }

    // connect + delete
    await connectMongoDB();
    const deleted = await Recipe.findOneAndDelete({
      _id: recipeId,
      author: session.user.id,
    });

    if (!deleted) {
      return NextResponse.json(
        { message: "Recipe not found or unauthorized" },
        { status: 404 }
      );
    }

    return NextResponse.json({ message: "Recipe deleted." }, { status: 200 });
  } catch (error) {
    console.error("Error deleting recipes: ", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}

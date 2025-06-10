import { NextRequest, NextResponse } from "next/server";
import User from "../../../../models/User";
import bcrypt from "bcryptjs";
import { connectMongoDB } from "../../../../lib/mongodb";

export async function POST(request: NextRequest) {
  try {
    const { firstName, lastName, email, password, confirmPassword } =
      await request.json();

    // check if all fields are filled
    if (!firstName || !lastName || !email || !password || !confirmPassword) {
      return NextResponse.json(
        { message: "All fields are required." },
        { status: 400 }
      );
    }

    // check if passwords match
    if (password !== confirmPassword) {
      return NextResponse.json(
        { message: "Passwords do not match." },
        { status: 400 }
      );
    }

    await connectMongoDB();

    const trimmedEmail = email.trim().toLowerCase();
    // check if email is already taken
    const existingEmail = await User.findOne({ email: trimmedEmail });
    if (existingEmail) {
      return NextResponse.json(
        { message: "The email has already been taken." },
        { status: 400 }
      );
    }

    // create user
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await User.create({
      firstName,
      lastName,
      email: trimmedEmail,
      password: hashedPassword,
    });
    return NextResponse.json(
      {
        message: "User created successfully.",
        newUser,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating user:", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}

import {commentModel} from "@/app/lib/models/model";
import {NextResponse} from "next/server";

// GET Request to fetch comments for a specific product
export async function GET(req) {
  const {searchParams} = new URL(req.url);
  const productId = searchParams.get("productId");

  try {
    // Fetch comments by productId
    const comments = await commentModel.find({productId});
    return NextResponse.json({comments}); // Return comments as an array
  } catch (error) {
    return NextResponse.json({errorMessage: error.message});
  }
}

// POST Request to create a new comment
export async function POST(req) {
  try {
    const data = await req.json();

    // Create a new comment with productId
    const newComment = await commentModel.create({
      productId: data.productId, // Ensure this matches GET
      user: data.userId,
      comment: data.comment,
    });

    return NextResponse.json({
      comment: newComment,
    });
  } catch (error) {
    return NextResponse.json({errorMessage: error.message});
  }
}

import {mongodbConnect} from "@/app/lib/db/db";
import {productModel} from "@/app/lib/models/model";
import mongoose from "mongoose";
import {NextResponse} from "next/server";

export async function POST(req) {
  try {
    await mongodbConnect();

    // Parse the request body to get the cart data
    const data = await req.json();
    const objectIdArray = data?.data?.id.map(
      (id) => new mongoose.Types.ObjectId(id)
    );

    // Find products based on their IDs
    const results = await productModel.find({
      _id: {$in: objectIdArray},
    });

    // Return the found products as a response
    return NextResponse.json({message: "Success", data: results});
  } catch (error) {
    return NextResponse.json({errorMessage: error.message});
  }
}

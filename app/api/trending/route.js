import {mongodbConnect} from "@/app/lib/db/db";
import {productModel} from "@/app/lib/models/model";
import {NextResponse} from "next/server";

export async function GET(req) {
  try {
    await mongodbConnect();
    const count = await productModel.countDocuments();
    const random = Math.floor(Math.random() * count);
    const products = await productModel.find({}).skip(random).limit(5);
    return NextResponse.json({data: products});
  } catch (error) {
    return NextResponse.json({errorMessage: error.message});
  }
}

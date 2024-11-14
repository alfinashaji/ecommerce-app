import {productModel} from "@/app/lib/models/model";
import {NextResponse} from "next/server";

export async function GET(req) {
  const {searchParams} = new URL(req.url);
  const param = searchParams.get("id");
  // console.log(param);
  try {
    const singleProduct = await productModel.findOne({_id: param});
    return NextResponse.json({data: singleProduct});
  } catch (error) {
    return NextResponse.json({errorMessage: error.message});
  }
}

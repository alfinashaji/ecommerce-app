import {productModel} from "@/app/lib/models/model";
import {NextResponse} from "next/server";

export async function GET(req) {
  try {
    const products = await productModel.find({});
    return NextResponse.json({data: products});
  } catch (error) {
    return NextResponse.json({errorMessage: error.message});
  }
}

export async function POST(req) {
  try {
    const data = await req.json();
    console.log(data);
    await productModel.insertMany([{...data}]);
    return NextResponse.json({message: "Success", data});
  } catch (error) {
    return NextResponse.json({errorMessage: error.message});
  }
}

export async function PUT(req) {
  try {
    const {id, ...data} = await req.json();
    const updatedProduct = await productModel.findByIdAndUpdate(id, data, {
      new: true,
    });
    return NextResponse.json({data: updatedProduct});
  } catch (error) {
    return NextResponse.json({errorMessage: error.message});
  }
}

export async function DELETE(req) {
  try {
    const {id} = await req.json();
    await productModel.findByIdAndDelete(id);
    return NextResponse.json({message: "Product deleted successfully"});
  } catch (error) {
    return NextResponse.json({errorMessage: error.message});
  }
}

import {categorieModel} from "@/app/lib/models/model";
import {NextResponse} from "next/server";
import {mongodbConnect} from "@/app/lib/db/db";
export async function GET(req) {
  try {
    await mongodbConnect();
    const categories = await categorieModel.find({});
    return NextResponse.json({data: categories});
  } catch (error) {
    return NextResponse.json({errorMessage: error.message});
  }
}

export async function POST(req) {
  try {
    await mongodbConnect();
    const data = await req.json();
    const newCategory = new categorieModel(data);
    await newCategory.save();
    return NextResponse.json({message: "Success", data: newCategory});
  } catch (error) {
    return NextResponse.json({errorMessage: error.message});
  }
}

export async function DELETE(req) {
  try {
    const {id} = await req.json();
    await categorieModel.findByIdAndDelete(id);
    return NextResponse.json({message: "Category deleted successfully"});
  } catch (error) {
    return NextResponse.json({errorMessage: error.message});
  }
}

export async function PUT(req) {
  try {
    const {id, ...updateData} = await req.json();
    const updatedCategory = await categorieModel.findByIdAndUpdate(
      id,
      updateData,
      {new: true}
    );
    return NextResponse.json({message: "Success", data: updatedCategory});
  } catch (error) {
    return NextResponse.json({errorMessage: error.message});
  }
}

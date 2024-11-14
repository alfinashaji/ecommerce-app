import {userModel} from "@/app/lib/models/model";
import {NextResponse} from "next/server";
import bcrypt from "bcrypt";
import {mongodbConnect} from "@/app/lib/db/db";
export async function GET(req) {
  try {
    const users = await userModel.find({});
    return NextResponse.json({data: users});
  } catch (error) {
    return NextResponse.json({errorMessage: error.message});
  }
}

export async function POST(req, res) {
  try {
    await mongodbConnect();

    const data = await req.json();
    const email = await data.email;
    console.log(data);
    // console.log(data);
    // const newUser = new usermodel({
    //   username: data.username,
    //   email: data.email,
    //   password: data.password,
    // });

    const hashedPassword = await bcrypt.hash(data.password, 12);
    const findemail = userModel.findOne({email});
    if (findemail) {
      console.log("user already registred!");
      // return NextResponse.json({
      //   message: "user already registred!",
      //   // data: data,
      // });
    }
    const newUser = await userModel.create({
      username: data.username,
      email: data.email,
      role: data.role,
      password: hashedPassword,
    });
    //   console.log(data);
    return NextResponse.json({
      message: "User created successfully",
      // data: data,
    });
  } catch (error) {
    console.log(error);
    return NextResponse.json({errorMessage: error.message});
  }
}

// PUT (update) user information
// export async function PUT(req) {
//   try {
//     const {id, ...data} = await req.json();
//     const updatedUser = await usermodel.findByIdAndUpdate(id, data, {
//       new: true,
//     });
//     return NextResponse.json({data: updatedUser});
//   } catch (error) {
//     return NextResponse.json({errorMessage: error.message});
//   }
// }

// // DELETE a user
// export async function DELETE(req) {
//   try {
//     const {id} = await req.json();
//     await usermodel.findByIdAndDelete(id);
//     return NextResponse.json({message: "User deleted successfully"});
//   } catch (error) {
//     return NextResponse.json({errorMessage: error.message});
//   }
// }

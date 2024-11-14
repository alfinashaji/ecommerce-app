import {orderModel} from "@/app/lib/models/model";
import {mongodbConnect} from "@/app/lib/db/db";
import {NextResponse} from "next/server";

export async function POST(request) {
  try {
    await mongodbConnect();
    const orderData = await request.json();
    const newOrder = await orderModel.insertMany(orderData);
    return NextResponse.json({message: "Success", data: newOrder});
  } catch (error) {
    console.error("Error placing order:", error);
    return NextResponse.json({error: "Failed to place order."}, {status: 500});
  }
}

export async function GET(request) {
  try {
    await mongodbConnect();
    const orderList = await orderModel.find({});

    const newArr = orderList.reduce((acc, order) => {
      const orderData = order.orderDetails[0].orderData.map((item) => ({
        ...item,
        orderId: order._id,
        fullname: order.orderDetails[0].fullName,
        email: order.orderDetails[0].email,
        address: order.orderDetails[0].address,
      }));
      return acc.concat(orderData);
    }, []);

    return NextResponse.json({
      message: "Success",
      data: newArr,
      fulldata: orderList,
    });
  } catch (error) {
    console.error("Error fetching orders:", error);
    return NextResponse.json({error: "Failed to fetch orders."}, {status: 500});
  }
}

export async function DELETE(req) {
  try {
    const {id} = await req.json();
    await orderModel.findByIdAndDelete(id);
    return NextResponse.json({message: "Category deleted successfully"});
  } catch (error) {
    return NextResponse.json({errorMessage: error.message});
  }
}

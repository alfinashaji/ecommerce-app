import {NextResponse} from "next/server";
import {orderModel} from "@/app/lib/models/model";
import {mongodbConnect} from "@/app/lib/db/db";
// import moment from "moment";
import moment from "moment-timezone";

export async function GET(request) {
  try {
    await mongodbConnect();

    const orders = await orderModel.find();
    console.log("Total orders fetched:", orders.length);

    const dateMap = orders.reduce((acc, order) => {
      // const date = moment(order.createdAt).format("MM-DD-yy");
      const date = moment
        .tz(order.createdAt, "Asia/Kolkata")
        .format("MM-DD-yy"); // Replace with your desired time zone
      console.log(date);

      acc[date] = (acc[date] || 0) + 1;
      console.log(acc);
      return acc;
    }, {});
    console.log(dateMap);

    const date = Object.keys(dateMap).reverse();
    const count = Object.values(dateMap);
    console.log(date);

    const all = Object.entries(dateMap);

    let dateMillisec = Object.entries(dateMap);
    return NextResponse.json({dateMillisec, count, all});
  } catch (error) {
    console.error("Error fetching orders:", error);
    return NextResponse.json({error: "Error fetching orders"}, {status: 500});
  }
}

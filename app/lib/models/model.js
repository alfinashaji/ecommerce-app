import mongoose from "mongoose";
import {
  userSchema,
  productSchema,
  categorieSchema,
  orderSchema,
  commentSchema,
} from "../schema/schema";

export const productModel =
  mongoose.models.products || mongoose.model("products", productSchema);

export const categorieModel =
  mongoose.models.categories || mongoose.model("categories", categorieSchema);

export const userModel =
  mongoose.models.userssec || mongoose.model("userssec", userSchema);

export const orderModel =
  mongoose.models.orderssec || mongoose.model("orderssec", orderSchema);

export const commentModel =
  mongoose.models.commentssec || mongoose.model("commentssec", commentSchema);

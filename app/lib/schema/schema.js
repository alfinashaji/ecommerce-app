import mongoose, {Schema} from "mongoose";

export const productSchema = mongoose.Schema(
  {
    productname: {type: String},
    description: {type: String},
    addprice: {type: String},
    imageurl: {type: String},
    category: {type: String},
  },
  {timestamps: true}
);

export const commentSchema = mongoose.Schema(
  {
    product: {type: String},
    user: {type: String},
    comment: {type: String},
  },
  {timestamps: true}
);

export const categorieSchema = mongoose.Schema(
  {
    categoriename: {type: String},
    categoriedescription: {type: String},
  },
  {timestamps: true}
);

export const userSchema = mongoose.Schema({
  username: {
    type: String,
    required: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
  },
  password: {type: String},
  role: {type: String, required: true, trim: true, lowercase: true},
});

//export const orderSchema = new Schema({any: {}});
export const orderSchema = mongoose.Schema(
  {orderDetails: Array},
  {timestamps: true}
  //   // username: {
  //   //   type: String,
  //   //   required: true,
  //   //   trim: true,
  //   // },
  //   // email: {
  //   //   type: String,
  //   //   required: true,
  //   //   unique: true,
  //   //   lowercase: true,
  //   //   trim: true,
  //   // },
  //   // fullname: {
  //   //   type: String,
  //   //   required: true,
  //   //   unique: true,
  //   //   lowercase: true,
  //   //   trim: true,
  //   // },
  //   // addprice: {
  //   //   type: String,
  //   //   required: true,
  //   //   unique: true,
  //   //   lowercase: true,
  //   //   trim: true,
  //   // },
  //   // category: {
  //   //   type: String,
  //   //   required: true,
  //   //   unique: true,
  //   //   lowercase: true,
  //   //   trim: true,
  //   // },
  //   // count: {
  //   //   type: String,
  //   //   required: true,
  //   //   unique: true,
  //   //   lowercase: true,
  //   //   trim: true,
  //   // },
  //   // description: {
  //   //   type: String,
  //   //   required: true,
  //   //   unique: true,
  //   //   lowercase: true,
  //   //   trim: true,
  //   // },
  //   // imageurl: {
  //   //   type: String,
  //   //   required: true,
  //   //   unique: true,
  //   //   lowercase: true,
  //   //   trim: true,
  //   // },
  //   // productname: {
  //   //   type: String,
  //   //   required: true,
  //   //   unique: true,
  //   //   lowercase: true,
  //   //   trim: true,
  //   // },
);

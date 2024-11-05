import mongoose from "mongoose"
const Schema = mongoose.Schema;

const FieldOwnerSchema = new Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true }, // Hashed
  fullname: { type: String, required: true },
  sex: { type: String, required: true },
  birthday: { type: Date, required: true },
  phone_no: { type: String, required: true },
  creation_date: { type: Date, default: Date.now },
  email: { type: String, required: true, unique: true },
  fields: [{ type: Schema.Types.ObjectId, ref: 'Field' }]
});

export const FieldOwner = mongoose.model("Field Owner", FieldOwnerSchema)
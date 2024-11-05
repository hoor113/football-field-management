import mongoose from "mongoose"
import bcrypt from "bcryptjs";

const Schema = mongoose.Schema;

const CustomerSchema = new Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true }, // Hashed
  fullname: { type: String, required: true },
  sex: { type: String, required: true },
  birthday: { type: Date, required: true },
  phone_no: { type: String, required: true },
  creation_date: { type: Date, default: Date.now },
  email: { type: String, required: true, unique: true },
  bookings: [{ type: Schema.Types.ObjectId, ref: 'Booking' }]
});


//Mã hóa mật khẩu trước khi lưu
CustomerSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});


// Hàm kiểm tra mật khẩu khi đăng nhập
/**
 * So sánh mật khẩu khi đăng nhập
 * @param {string} password
 * @returns {Promise<boolean>} 
 */
CustomerSchema.methods.comparePassword = async function(password) {
  return bcrypt.compare(password, this.password);
};


export const Customer = mongoose.model("Customer", CustomerSchema)
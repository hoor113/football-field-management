import mongoose from "mongoose";
const { Schema } = mongoose;

// Định nghĩa TournamentSchema
const TournamentSchema = new Schema({
  organizer_id: { type: Schema.Types.ObjectId, ref: 'User', required: true }, // Người tổ chức
  name: { type: String, required: true, trim: true }, // Tên giải đấu
  description: { type: String, trim: true }, // Mô tả giải đấu
  type: { 
    type: String, 
    required: true, 
    enum: ['Giao hữu', 'Chính thức', 'Từ thiện'] 
  }, // Loại giải đấu
  team_limit: { type: Number, required: true, min: 2 }, // Số đội tối đa
  start_date: { type: Date, required: true }, // Ngày bắt đầu
  end_date: { type: Date, required: true }, // Ngày kết thúc
  fee: { type: Schema.Types.Decimal128, default: 0, min: 0 }, // Phí tham gia
  prize: { type: String }, // Giải thưởng (tuỳ chọn)
  status: { 
    type: String, 
    enum: ['pending', 'ongoing', 'completed'], 
    default: 'pending' 
  }, // Trạng thái
  created_at: { type: Date, default: Date.now }, // Thời điểm tạo
  updated_at: { type: Date, default: Date.now } // Thời điểm cập nhật
});

// Middleware để cập nhật `updated_at` khi chỉnh sửa
TournamentSchema.pre('save', function (next) {
  this.updated_at = Date.now();
  next();
});

export const Tournament = mongoose.model("Tournament", TournamentSchema);

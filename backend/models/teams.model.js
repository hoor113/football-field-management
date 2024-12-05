import mongoose from "mongoose";
const { Schema } = mongoose;

// Định nghĩa TeamSchema
const TeamSchema = new Schema({
  tournament_id: { type: Schema.Types.ObjectId, ref: 'Tournament', required: true }, // Tham chiếu đến giải đấu
  name: { type: String, required: true }, // Tên đội
  captain_name: { type: String, required: true }, // Tên đội trưởng
  members: [
    {
      name: { type: String, required: true }, // Tên thành viên
      number: { type: Number, required: true }, // Số áo
      position: { type: String, required: true } // Vị trí
    }
  ], // Danh sách thành viên
  status: { 
    type: String, 
    enum: ['pending', 'approved'], 
    default: 'pending' 
  } // Trạng thái của đội (chờ phê duyệt hay đã phê duyệt)
});

export const Team = mongoose.model("Team", TeamSchema);

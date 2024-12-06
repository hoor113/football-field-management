import { Tournament } from "../models/tournaments.model.js";
import { Team } from "../models/teams.model.js";

export const registerTeam = async (req, res) => {
  try {
    const { tournament_id, team_name, captain_name, members } = req.body;

    // Tìm giải đấu theo ID
    const tournament = await Tournament.findById(tournament_id);
    if (!tournament) {
      return res.status(404).json({ message: "Giải đấu không tồn tại" });
    }

    // Kiểm tra số đội đã đăng ký
    const existingTeamsCount = await Team.countDocuments({ tournament_id });
    if (existingTeamsCount >= tournament.team_limit) {
      return res.status(400).json({ message: "Đã đủ số đội tham gia giải đấu" });
    }

    // Tạo đội mới
    const newTeam = new Team({
      tournament_id,
      name: team_name,
      captain_name,
      members,
      status: 'pending' // Trạng thái đội chờ phê duyệt
    });

    // Lưu đội bóng vào cơ sở dữ liệu
    await newTeam.save();

    return res.status(201).json({
      message: "Đội đã đăng ký thành công. Chờ phê duyệt từ chủ sân.",
      team: newTeam
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Có lỗi xảy ra khi đăng ký đội" });
  }
};

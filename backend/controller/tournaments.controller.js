import { Tournament } from "../models/tournaments.model.js";
import { Team } from "../models/teams.model.js";

// Tạo giải đấu mới
export const createTournament = async (req, res) => {
  try {
    const { name, description, type, team_limit, start_date, end_date, fee, prize } = req.body;

    // Kiểm tra nếu thiếu trường cần thiết
    if (!name || !type || !start_date || !end_date || !team_limit) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const tournament = new Tournament({
      organizer_id: req.user.id,  // ID người tổ chức từ token
      name,
      description,
      type,
      team_limit,
      start_date,
      end_date,
      fee,
      prize,
    });

    await tournament.save();
    res.status(201).json({ message: "Tournament created successfully", data: tournament });
  } catch (error) {
    res.status(500).json({ message: "Error creating tournament", error: error.message });
  }
};


// Lấy danh sách tất cả giải đấu
export const getAllTournaments = async (req, res) => {
  try {
    const tournaments = await Tournament.find();
    res.status(200).json(tournaments);
  } catch (error) {
    res.status(500).json({ message: "Không thể lấy danh sách giải đấu", error: error.message });
  }
};

// Lấy thông tin một giải đấu cụ thể
export const getTournamentById = async (req, res) => {
  try {
    const { id } = req.params;
    const tournament = await Tournament.findById(id).populate("organizer_id");

    if (!tournament) {
      return res.status(404).json({ message: "Không tìm thấy giải đấu" });
    }

    res.status(200).json(tournament);
  } catch (error) {
    res.status(500).json({ message: "Không thể lấy thông tin giải đấu", error: error.message });
  }
};

// Cập nhật thông tin giải đấu
export const updateTournament = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    const tournament = await Tournament.findByIdAndUpdate(id, updateData, { new: true });

    if (!tournament) {
      return res.status(404).json({ message: "Không tìm thấy giải đấu để cập nhật" });
    }

    res.status(200).json(tournament);
  } catch (error) {
    res.status(500).json({ message: "Không thể cập nhật giải đấu", error: error.message });
  }
};

// Xóa giải đấu
export const deleteTournament = async (req, res) => {
  try {
    const { id } = req.params;

    const tournament = await Tournament.findByIdAndDelete(id);

    if (!tournament) {
      return res.status(404).json({ message: "Không tìm thấy giải đấu để xóa" });
    }

    res.status(200).json({ message: "Giải đấu đã được xóa thành công" });
  } catch (error) {
    res.status(500).json({ message: "Không thể xóa giải đấu", error: error.message });
  }
};

// Cấp phép cho đội tham gia giải
export const approveTeam = async (req, res) => {
  try {
    const { tournament_id, team_name } = req.body;

    // Kiểm tra giải đấu tồn tại
    const tournament = await Tournament.findById(tournament_id);
    if (!tournament) {
      return res.status(404).json({ message: "Giải đấu không tồn tại" });
    }

    // Tìm đội bóng trong bảng Team
    const team = await Team.findOne({ tournament_id, name: team_name });
    if (!team) {
      return res.status(404).json({ message: "Đội không tồn tại trong giải đấu" });
    }

    // Cập nhật trạng thái đội bóng
    team.status = 'approved';
    await team.save();

    return res.status(200).json({ message: "Đội đã được phê duyệt", team });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Có lỗi xảy ra khi phê duyệt đội" });
  }
};


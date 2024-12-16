import { Tournament } from "../models/tournaments.model.js";
import { Team } from "../models/teams.model.js";

// Hàm đăng ký đội hiện tại
export const registerTeam = async (req, res) => {
    try {
        const { tournament_id, team_name, captain_name, members } = req.body;

        // Tìm giải đấu theo ID
        const tournament = await Tournament.findById(tournament_id);
        if (!tournament) {
            return res.status(404).json({ message: "Giải đấu không tồn tại" });
        }

        // Kiểm tra xem customer đã đăng ký team cho giải đấu này chưa
        const existingTeam = await Team.findOne({
            tournament_id,
            captain_name: req.user.fullname // Sử dụng fullname từ token
        });

        if (existingTeam) {
            return res.status(400).json({ 
                message: "Bạn đã đăng ký một đội cho giải đấu này rồi" 
            });
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
            status: 'pending'
        });

        await newTeam.save();

        return res.status(201).json({
            message: "Đội đã đăng ký thành công. Chờ phê duyệt từ ban tổ chức.",
            team: newTeam
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Có lỗi xảy ra khi đăng ký đội" });
    }
};

// Thêm hàm lấy danh sách đội đã đăng ký của user
export const getMyRegistrations = async (req, res) => {
    try {
        const teams = await Team.find({ 
            captain_name: req.user.fullname
        });
        
        // Đảm bảo trả về ID dưới dạng string
        const registrations = teams.map(team => ({
            tournament_id: team.tournament_id.toString(),
            status: team.status
        }));
        
        console.log('Sending registrations:', registrations); // Debug
        res.json(registrations);
    } catch (error) {
        console.error('Error in getMyRegistrations:', error);
        res.status(500).json({ message: "Lỗi khi lấy thông tin đội đã đăng ký" });
    }
};

// Thêm hàm lấy danh sách đội chờ phê duyệt theo tournament_id
export const getPendingTeams = async (req, res) => {
    try {
        const { tournament_id } = req.params;

        // Tìm tất cả các đội có tournament_id tương ứng và status là 'pending'
        const pendingTeams = await Team.find({
            tournament_id,
            status: 'pending'
        });

        res.json({
            success: true,
            pendingTeams
        });
    } catch (error) {
        console.error('Error getting pending teams:', error);
        res.status(500).json({ 
            success: false,
            message: "Lỗi khi lấy danh sách đội chờ phê duyệt" 
        });
    }
};

// Sửa lại hàm approveTeam để cập nhật status
export const approveTeam = async (req, res) => {
    try {
        const { tournament_id, team_id } = req.body;

        // Tìm và cập nhật trạng thái của đội
        const updatedTeam = await Team.findByIdAndUpdate(
            team_id,
            { status: 'approved' },
            { new: true }
        );

        if (!updatedTeam) {
            return res.status(404).json({
                success: false,
                message: "Không tìm thấy đội bóng"
            });
        }

        res.json({
            success: true,
            message: "Phê duyệt đội thành công",
            team: updatedTeam
        });
    } catch (error) {
        console.error('Error approving team:', error);
        res.status(500).json({
            success: false,
            message: "Lỗi khi phê duyệt đội"
        });
    }
};

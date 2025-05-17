import { Tournament } from "#backend/models/tournaments.model.js";
import { Team } from "#backend/models/teams.model.js";

/**
 * @swagger
 * /api/tournaments:
 *   get:
 *     summary: Lấy danh sách tất cả giải đấu
 *     tags: [Tournament]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Thành công
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Tournament'
 *       500:
 *         description: Lỗi server
 */
export const getAllTournaments = async (req, res) => {
  try {
    const tournaments = await Tournament.find();
    res.status(200).json(tournaments);
  } catch (error) {
    res.status(500).json({ message: "Không thể lấy danh sách giải đấu", error: error.message });
  }
};

/**
 * @swagger
 * /api/tournaments:
 *   post:
 *     summary: Tạo giải đấu mới
 *     tags: [Tournament]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - type
 *               - team_limit
 *               - start_date
 *               - end_date
 *             properties:
 *               name:
 *                 type: string
 *                 description: Tên giải đấu
 *               description:
 *                 type: string
 *                 description: Mô tả giải đấu
 *               type:
 *                 type: string
 *                 description: Loại giải đấu (5 người, 7 người, etc)
 *               team_limit:
 *                 type: number
 *                 description: Số đội tối đa có thể tham gia
 *               start_date:
 *                 type: string
 *                 format: date
 *                 description: Ngày bắt đầu giải
 *               end_date:
 *                 type: string
 *                 format: date
 *                 description: Ngày kết thúc giải
 *               fee:
 *                 type: number
 *                 description: Phí tham gia
 *               prize:
 *                 type: number
 *                 description: Giải thưởng
 *     responses:
 *       201:
 *         description: Tạo giải đấu thành công
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 data:
 *                   $ref: '#/components/schemas/Tournament'
 *       400:
 *         description: Thiếu thông tin bắt buộc
 *       500:
 *         description: Lỗi server
 */
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

/**
 * @swagger
 * /api/tournaments/{id}:
 *   get:
 *     summary: Lấy thông tin chi tiết một giải đấu
 *     tags: [Tournament]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID của giải đấu
 *     responses:
 *       200:
 *         description: Thành công
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Tournament'
 *       404:
 *         description: Không tìm thấy giải đấu
 */
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

/**
 * @swagger
 * /api/tournaments/{id}:
 *   put:
 *     summary: Cập nhật thông tin giải đấu
 *     tags: [Tournament]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID của giải đấu
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               type:
 *                 type: string
 *               team_limit:
 *                 type: number
 *               start_date:
 *                 type: string
 *                 format: date
 *               end_date:
 *                 type: string
 *                 format: date
 *               fee:
 *                 type: number
 *               prize:
 *                 type: number
 *     responses:
 *       200:
 *         description: Cập nhật thành công
 *       404:
 *         description: Không tìm thấy giải đấu
 */
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

/**
 * @swagger
 * /api/tournaments/{id}:
 *   delete:
 *     summary: Xóa giải đấu
 *     tags: [Tournament]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID của giải đấu
 *     responses:
 *       200:
 *         description: Xóa thành công
 *       404:
 *         description: Không tìm thấy giải đấu
 */
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

/**
 * @swagger
 * /api/tournaments/teams/approve:
 *   post:
 *     summary: Phê duyệt đội tham gia giải
 *     tags: [Team]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - tournament_id
 *               - team_id
 *             properties:
 *               tournament_id:
 *                 type: string
 *               team_id:
 *                 type: string
 *     responses:
 *       200:
 *         description: Phê duyệt thành công
 *       404:
 *         description: Không tìm thấy giải đấu hoặc đội
 */
export const approveTeam = async (req, res) => {
  try {
    const { tournament_id, team_id } = req.body;

    // Kiểm tra giải đấu tồn tại
    const tournament = await Tournament.findById(tournament_id);
    if (!tournament) {
      return res.status(404).json({ message: "Giải đấu không tồn tại" });
    }

    // Tìm đội bóng trong bảng Team bằng ID
    const team = await Team.findById(team_id);
    if (!team) {
      return res.status(404).json({ message: "Đội không tồn tại trong giải đấu" });
    }

    // Kiểm tra xem team có thuộc tournament này không
    if (team.tournament_id.toString() !== tournament_id) {
      return res.status(400).json({ message: "Đội không thuộc giải đấu này" });
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


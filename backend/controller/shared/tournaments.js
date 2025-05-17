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
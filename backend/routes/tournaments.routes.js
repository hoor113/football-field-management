import express from "express";
import { authenticateToken, checkRole } from "../controller/verify.js";
import {
  createTournament,
  getAllTournaments,
  getTournamentById,
  updateTournament,
  deleteTournament,
  approveTeam,
} from "../controller/tournaments.controller.js";
import { registerTeam, getMyRegistrations, getPendingTeams } from "../controller/teamController.js";

const router4 = express.Router();

// Tournament Routes

//tạo giải đấu  
router4.post("/", authenticateToken, checkRole(['fieldOwner']), createTournament); 

//lấy tất cả giải đấu
router4.get("/", authenticateToken, getAllTournaments);

//lấy giải đấu theo id
router4.get("/:id", authenticateToken, getTournamentById);

//cập nhật giải đấu
router4.put("/:id", authenticateToken, checkRole(['fieldOwner']), updateTournament);

//xóa giải đấu
router4.delete("/:id", authenticateToken, checkRole(['fieldOwner']), deleteTournament); 

// Team Routes
router4.post("/teams/register", authenticateToken, checkRole(['customer']), registerTeam); 
router4.post("/teams/approve", authenticateToken, checkRole(['fieldOwner']), approveTeam); 
router4.get("/teams/my-registrations", authenticateToken, checkRole(['customer']), getMyRegistrations);

// Thêm route để lấy danh sách đội chờ phê duyệt
router4.get("/:tournament_id/pending-teams", authenticateToken, checkRole(['fieldOwner']), getPendingTeams);

export default router4;

import express from "express";
import { authenticateToken, checkRole } from "#backend/controller/verify.js";
import {
  createTournament,
  getAllTournaments,
  getTournamentById,
  updateTournament,
  deleteTournament,
  approveTeam,
} from "#backend/controller/tournaments.controller.js";
import { 
  registerTeam, 
  getMyRegistrations, 
  getPendingTeams 
} from "#backend/controller/teamController.js";

const tournamentRouter = express.Router();

// Tournament Routes

//tạo giải đấu  
tournamentRouter.post("/", authenticateToken, checkRole(['fieldOwner']), createTournament); 

//lấy tất cả giải đấu
tournamentRouter.get("/", authenticateToken, getAllTournaments);

//lấy giải đấu theo id
tournamentRouter.get("/:id", authenticateToken, getTournamentById);

//cập nhật giải đấu
tournamentRouter.put("/:id", authenticateToken, checkRole(['fieldOwner']), updateTournament);

//xóa giải đấu
tournamentRouter.delete("/:id", authenticateToken, checkRole(['fieldOwner']), deleteTournament); 

// Team Routes
tournamentRouter.post("/teams/register", authenticateToken, checkRole(['customer']), registerTeam); 
tournamentRouter.post("/teams/approve", authenticateToken, checkRole(['fieldOwner']), approveTeam); 
tournamentRouter.get("/teams/my-registrations", authenticateToken, checkRole(['customer']), getMyRegistrations);

// Thêm route để lấy danh sách đội chờ phê duyệt
tournamentRouter.get("/:tournament_id/pending-teams", authenticateToken, checkRole(['fieldOwner']), getPendingTeams);

export default tournamentRouter;

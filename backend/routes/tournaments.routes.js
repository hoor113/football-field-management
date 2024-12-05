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
import { registerTeam } from "../controller/teamController.js";

const router4 = express.Router();

// Tournament Routes
router4.post("/", authenticateToken, checkRole(['fieldOwner']), createTournament); 
router4.get("/", authenticateToken, getAllTournaments);
router4.get("/:id", authenticateToken, getTournamentById);
router4.put("/:id", authenticateToken, checkRole(['fieldOwner']), updateTournament);
router4.delete("/:id", authenticateToken, checkRole(['fieldOwner']), deleteTournament); 

// Team Routes
router4.post("/teams/register", authenticateToken, checkRole(['customer']), registerTeam); 
router4.post("/teams/approve", authenticateToken, checkRole(['fieldOwner']), approveTeam); 

export default router4;

import express from "express";
import * as UserController from "../controllers/userController.js";
import { validateUserInput } from "../middleware/validateUserInput.js";

const router = express.Router();

// routes
router.post("/", validateUserInput, UserController.createUser);
router.get("/", UserController.getAllUsers);
router.get("/:id", UserController.getUserById);
router.put("/:id", UserController.updateUserEmail);
router.delete("/:id", UserController.deleteUser);

export default router;

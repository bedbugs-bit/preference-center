import express from "express";
import * as UserController from "../controllers/userController.js";

const router = express.Router();

// routes
router.post("/users", UserController.createUser);
router.get("/users", UserController.getAllUsers);
router.get("/users/:id", UserController.getUserById);
router.put("/users/:id", UserController.updateUserEmail);
router.delete("/users/:id", UserController.deleteUser);


export default router;
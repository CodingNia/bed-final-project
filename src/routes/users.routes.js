import express from "express";
import { requireAuth } from "../middleware/auth.js";

import {
  getUsers,
  createUser,
  getUserById,
  updateUser,
  deleteUser,
} from "../services/users.service.js";

const router = express.Router();

router.get("/", async (req, res, next) => {
  try {
    const users = await getUsers({
      username: req.query.username,
      email: req.query.email,
    });
    res.status(200).json(users);
  } catch (err) {
    next(err);
  }
});
router.post("/", requireAuth, async (req, res, next) => {
  try {
    const user = await createUser(req.body);
    res.status(201).json(user);
  } catch (err) {
    next(err);
  }
});
router.get("/:id", async (req, res, next) => {
  try {
    const user = await getUserById(req.params.id);
    if (!user) return res.status(404).json({ message: "Not found" });
    res.status(200).json(user);
  } catch (err) {
    next(err);
  }
});

router.put("/:id", requireAuth, async (req, res, next) => {
  try {
    const user = await updateUser(req.params.id, req.body);
    if (!user) return res.status(404).json({ message: "Not found" });
    res.status(200).json(user);
  } catch (err) {
    next(err);
  }
});
router.delete("/:id", requireAuth, async (req, res, next) => {
  try {
    const ok = await deleteUser(req.params.id);
    if (!ok) return res.status(404).json({ message: "Not found" });
    res.status(204).send();
  } catch (err) {
    next(err);
  }
});

export default router;

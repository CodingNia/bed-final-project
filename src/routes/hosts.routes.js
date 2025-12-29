import express from "express";
import { requireAuth } from "../middleware/auth.js";

import {
  getHosts,
  createHost,
  updateHost,
  deleteHost,
} from "../services/hosts.service.js";

const router = express.Router();

// GET /hosts (openbaar) + filter ?name
router.get("/", async (req, res, next) => {
  try {
    const hosts = await getHosts({ name: req.query.name });
    res.status(200).json(hosts);
  } catch (err) {
    next(err);
  }
});

// POST /hosts (protected)
router.post("/", requireAuth, async (req, res, next) => {
  try {
    const host = await createHost(req.body);
    res.status(201).json(host);
  } catch (err) {
    next(err);
  }
});

// PUT /hosts/:id (protected)
router.put("/:id", requireAuth, async (req, res, next) => {
  try {
    const host = await updateHost(req.params.id, req.body);
    if (!host) return res.status(404).json({ message: "Not found" });
    res.status(200).json(host);
  } catch (err) {
    next(err);
  }
});

// DELETE /hosts/:id (protected)
router.delete("/:id", requireAuth, async (req, res, next) => {
  try {
    const ok = await deleteHost(req.params.id);
    if (!ok) return res.status(404).json({ message: "Not found" });
    res.status(204).send();
  } catch (err) {
    next(err);
  }
});

export default router;

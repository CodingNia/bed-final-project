import express from "express";
import { requireAuth } from "../middleware/auth.js";
import {
  getProperties,
  getPropertyById,
  createProperty,
  updateProperty,
  deleteProperty,
} from "../services/properties.service.js";

const router = express.Router();

router.get("/", async (req, res, next) => {
  try {
    const properties = await getProperties({
      location: req.query.location,
      pricePerNight: req.query.pricePerNight,
    });
    res.status(200).json(properties);
  } catch (err) {
    next(err);
  }
});

router.get("/:id", async (req, res, next) => {
  try {
    const property = await getPropertyById(req.params.id);
    if (!property)
      return res.status(404).json({ message: "Property not found" });
    res.status(200).json(property);
  } catch (err) {
    next(err);
  }
});

router.post("/", requireAuth, async (req, res, next) => {
  try {
    const property = await createProperty(req.body);
    res.status(201).json(property);
  } catch (err) {
    next(err);
  }
});

router.put("/:id", requireAuth, async (req, res, next) => {
  try {
    const property = await updateProperty(req.params.id, req.body);
    if (!property)
      return res.status(404).json({ message: "Property not found" });
    res.status(200).json(property);
  } catch (err) {
    next(err);
  }
});

router.delete("/:id", requireAuth, async (req, res, next) => {
  try {
    const ok = await deleteProperty(req.params.id);
    if (!ok) return res.status(404).json({ message: "Property not found" });
    res.status(200).json({ message: "Property deleted successfully" });
  } catch (err) {
    next(err);
  }
});

export default router;

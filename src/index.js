import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import jwt from "jsonwebtoken";
import * as Sentry from "@sentry/node";
import hostsRoutes from "./routes/hosts.routes.js";
import usersRoutes from "./routes/users.routes.js";
import propertiesRoutes from "./routes/properties.routes.js";
import bookingsRoutes from "./routes/bookings.routes.js";
import reviewsRoutes from "./routes/reviews.routes.js";
import { prisma } from "./prisma/client.js";
import { errorHandler } from "./middleware/errorHandler.js";
import { requestLogger } from "./middleware/logger.js";

dotenv.config();

Sentry.init({
  dsn: process.env.SENTRY_DSN || "",
});

const app = express();

app.use(cors());
app.use(express.json());
app.use(requestLogger);

app.get("/", (req, res) => {
  res.send("Hello world!");
});

app.use("/hosts", hostsRoutes);
app.use("/users", usersRoutes);
app.use("/properties", propertiesRoutes);
app.use("/bookings", bookingsRoutes);
app.use("/reviews", reviewsRoutes);

app.post("/login", async (req, res, next) => {
  try {
    const body = req.body ?? {};
    const username = body.username;
    const password = body.password;

    if (!username || !password) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const user = await prisma.user.findUnique({
      where: { username },
    });

    if (!user || user.password !== password) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    if (!process.env.JWT_SECRET) {
      return res
        .status(500)
        .json({ message: "Server misconfigured: missing JWT_SECRET" });
    }

    const token = jwt.sign(
      { id: user.id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1h" },
    );

    return res.status(200).json({ token });
  } catch (err) {
    return next(err);
  }
});

app.use((req, res) => {
  res.status(404).json({ message: "Not found" });
});

app.use(errorHandler);

app.listen(3000, () => {
  console.log("Server is listening on port 3000");
});

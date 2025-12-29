import express from "express";
import dotenv from "dotenv";
import jwt from "jsonwebtoken";
import hostsRoutes from "./routes/hosts.routes.js";
import usersRoutes from "./routes/users.routes.js";
import { prisma } from "./prisma/client.js";
import { errorHandler } from "./middleware/errorHandler.js";

dotenv.config();

const app = express();

app.use(express.json());

app.get("/", (req, res) => {
  res.send("Hello world!");
});
app.use("/hosts", hostsRoutes);

app.use("/users", usersRoutes);

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
      { expiresIn: "1h" }
    );

    return res.status(200).json({ token });
  } catch (err) {
    return next(err);
  }
});

// 404 JSON (handig voor negative tests)
app.use((req, res) => {
  res.status(404).json({ message: "Not found" });
});

// error handler als laatste
app.use(errorHandler);

app.listen(3000, () => {
  console.log("Server is listening on port 3000");
});

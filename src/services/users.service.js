import { prisma } from "../prisma/client.js";

export async function getUsers({ username, email } = {}) {
  const where = {};
  if (username) where.username = username;
  if (email) where.email = email;

  return prisma.user.findMany({
    where,
    select: {
      id: true,
      username: true,
      name: true,
      email: true,
      phoneNumber: true,
      role: true,
    },
  });
}

export async function createUser(data) {
  const { username, password, name, email, phoneNumber, role } = data ?? {};

  if (!username || !password || !name || !email || !phoneNumber || !role) {
    const err = new Error("Missing required fields");
    err.status = 500;
    throw err;
  }

  const created = await prisma.user.create({
    data: { username, password, name, email, phoneNumber, role },
    select: {
      id: true,
      username: true,
      name: true,
      email: true,
      phoneNumber: true,
      role: true,
    },
  });

  return created;
}

export async function getUserById(id) {
  return prisma.user.findUnique({
    where: { id },
    select: {
      id: true,
      username: true,
      name: true,
      email: true,
      phoneNumber: true,
      role: true,
    },
  });
}

export async function updateUser(id, data) {
  const clean = Object.fromEntries(
    Object.entries(data ?? {}).filter(([, v]) => v !== undefined)
  );
  try {
    return await prisma.user.update({
      where: { id },
      data: clean,
      select: {
        id: true,
        username: true,
        name: true,
        email: true,
        phoneNumber: true,
        role: true,
      },
    });
  } catch {
    return null;
  }
}

export async function deleteUser(id) {
  try {
    await prisma.user.delete({ where: { id } });
    return true;
  } catch {
    return false;
  }
}

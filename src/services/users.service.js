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

  if (!username || !password || !name || !email || !phoneNumber) {
    const err = new Error("Missing required fields");
    err.status = 400;
    throw err;
  }

  return prisma.user.create({
    data: {
      username,
      password,
      name,
      email,
      phoneNumber,
      role: role ?? "USER",
    },
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
    Object.entries(data ?? {}).filter(([, v]) => v !== undefined),
  );

  delete clean.pictureUrl;

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
    // Eerst de bookings en reviews van de user verwijderen voordat ik de user zelf verwijder.
    // SQLite doet dit niet automatisch.
    await prisma.booking.deleteMany({ where: { userId: id } });
    await prisma.review.deleteMany({ where: { userId: id } });
    await prisma.user.delete({ where: { id } });
    return true;
  } catch {
    return false;
  }
}

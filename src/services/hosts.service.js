import { prisma } from "../prisma/client.js";

export async function getHosts({ name } = {}) {
  const where = {};
  if (name) where.name = name;

  return prisma.host.findMany({
    where,
    select: {
      id: true,
      username: true,
      name: true,
      email: true,
      phoneNumber: true,
      location: true,
    },
  });
}

export async function createHost(data) {
  const { username, password, name, email, phoneNumber, location } = data ?? {};

  if (!username || !password || !name || !email || !phoneNumber || !location) {
    const err = new Error("Missing required fields");
    err.status = 500;
    throw err;
  }

  return prisma.host.create({
    data: { username, password, name, email, phoneNumber, location },
    select: {
      id: true,
      username: true,
      name: true,
      email: true,
      phoneNumber: true,
      location: true,
    },
  });
}

export async function updateHost(id, data) {
  const clean = Object.fromEntries(
    Object.entries(data ?? {}).filter(([, v]) => v !== undefined)
  );

  try {
    return await prisma.host.update({
      where: { id },
      data: clean,
      select: {
        id: true,
        username: true,
        name: true,
        email: true,
        phoneNumber: true,
        location: true,
      },
    });
  } catch {
    return null;
  }
}

export async function deleteHost(id) {
  try {
    await prisma.host.delete({ where: { id } });
    return true;
  } catch {
    return false;
  }
}

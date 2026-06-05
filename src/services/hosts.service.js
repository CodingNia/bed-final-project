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

export async function getHostById(id) {
  return prisma.host.findUnique({
    where: { id },
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
  const { username, password, name, email, phoneNumber, location, aboutMe } =
    data ?? {};

  if (!username || !password || !name || !email || !phoneNumber) {
    const err = new Error("Missing required fields");
    err.status = 400;
    throw err;
  }

  return prisma.host.create({
    data: {
      username,
      password,
      name,
      email,
      phoneNumber,
      location: location ?? aboutMe ?? "",
    },
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
    Object.entries(data ?? {}).filter(([, v]) => v !== undefined),
  );

  delete clean.pictureUrl;
  delete clean.aboutMe;

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
    // Eerst de bookings en reviews van elke property verwijderen, daarna de properties zelf,
    // voordat ik de host kan verwijderen. SQLite verwijdert dit niet automatisch.
    const properties = await prisma.property.findMany({
      where: { hostId: id },
    });
    for (const p of properties) {
      await prisma.booking.deleteMany({ where: { propertyId: p.id } });
      await prisma.review.deleteMany({ where: { propertyId: p.id } });
    }
    await prisma.property.deleteMany({ where: { hostId: id } });
    await prisma.host.delete({ where: { id } });
    return true;
  } catch {
    return false;
  }
}

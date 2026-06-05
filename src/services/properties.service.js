import { prisma } from "../prisma/client.js";

export async function getProperties({ location, pricePerNight } = {}) {
  const where = {};

  if (location) {
    where.location = {
      contains: location,
    };
  }

  if (pricePerNight !== undefined && pricePerNight !== "") {
    const n = Number(pricePerNight);
    if (!Number.isNaN(n)) where.pricePerNight = n;
  }

  return prisma.property.findMany({ where });
}

export async function getPropertyById(id) {
  return prisma.property.findUnique({ where: { id } });
}

export async function createProperty(data) {
  const {
    hostId,
    title,
    description,
    location,
    pricePerNight,
    bedroomCount,
    bathroomCount,
    bathRoomCount,
    maxGuestCount,
    rating,
  } = data ?? {};

  const bathrooms = bathroomCount ?? bathRoomCount;

  if (
    !hostId ||
    !title ||
    !description ||
    !location ||
    pricePerNight === undefined ||
    bedroomCount === undefined ||
    bathrooms === undefined ||
    maxGuestCount === undefined ||
    rating === undefined
  ) {
    const err = new Error("Missing required fields");
    err.status = 400;
    throw err;
  }

  const host = await prisma.host.findUnique({ where: { id: hostId } });
  if (!host) {
    const err = new Error("Host not found");
    err.status = 404;
    throw err;
  }

  return prisma.property.create({
    data: {
      hostId,
      title,
      description,
      location,
      pricePerNight: Number(pricePerNight),
      bedroomCount: Number(bedroomCount),
      bathroomCount: Number(bathrooms),
      maxGuestCount: Number(maxGuestCount),
      rating: Number(rating),
    },
  });
}

export async function updateProperty(id, data) {
  const clean = Object.fromEntries(
    Object.entries(data ?? {}).filter(([, v]) => v !== undefined),
  );

  if (clean.bathRoomCount !== undefined) {
    clean.bathroomCount = Number(clean.bathRoomCount);
    delete clean.bathRoomCount;
  }
  if (clean.pricePerNight !== undefined)
    clean.pricePerNight = Number(clean.pricePerNight);
  if (clean.bedroomCount !== undefined)
    clean.bedroomCount = Number(clean.bedroomCount);
  if (clean.bathroomCount !== undefined)
    clean.bathroomCount = Number(clean.bathroomCount);
  if (clean.maxGuestCount !== undefined)
    clean.maxGuestCount = Number(clean.maxGuestCount);
  if (clean.rating !== undefined) clean.rating = Number(clean.rating);

  try {
    return await prisma.property.update({ where: { id }, data: clean });
  } catch {
    return null;
  }
}

export async function deleteProperty(id) {
  try {
    await prisma.property.delete({ where: { id } });
    return true;
  } catch {
    return false;
  }
}

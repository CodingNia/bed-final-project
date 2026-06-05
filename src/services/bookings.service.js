import { prisma } from "../prisma/client.js";

export async function getBookings({ userId } = {}) {
  const where = {};
  if (userId) where.userId = userId;
  return prisma.booking.findMany({ where });
}

export async function getBookingById(id) {
  return prisma.booking.findUnique({ where: { id } });
}

export async function createBooking(data) {
  const { userId, propertyId, numberOfGuests, totalPrice, bookingStatus } =
    data ?? {};
  const checkIn = data.checkInDate ?? data.checkinDate;
  const checkOut = data.checkOutDate ?? data.checkoutDate;

  if (
    !userId ||
    !propertyId ||
    !checkIn ||
    !checkOut ||
    numberOfGuests === undefined ||
    totalPrice === undefined ||
    !bookingStatus
  ) {
    const err = new Error("Missing required fields");
    err.status = 400;
    throw err;
  }

  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) {
    const err = new Error("User not found");
    err.status = 404;
    throw err;
  }

  const property = await prisma.property.findUnique({
    where: { id: propertyId },
  });
  if (!property) {
    const err = new Error("Property not found");
    err.status = 404;
    throw err;
  }

  return prisma.booking.create({
    data: {
      userId,
      propertyId,
      checkInDate: new Date(checkIn),
      checkOutDate: new Date(checkOut),
      numberOfGuests: Number(numberOfGuests),
      totalPrice: Number(totalPrice),
      bookingStatus,
    },
  });
}

export async function updateBooking(id, data) {
  const clean = Object.fromEntries(
    Object.entries(data ?? {}).filter(([, v]) => v !== undefined),
  );

  if (clean.checkinDate) {
    clean.checkInDate = new Date(clean.checkinDate);
    delete clean.checkinDate;
  }
  if (clean.checkoutDate) {
    clean.checkOutDate = new Date(clean.checkoutDate);
    delete clean.checkoutDate;
  }
  if (clean.checkInDate) clean.checkInDate = new Date(clean.checkInDate);
  if (clean.checkOutDate) clean.checkOutDate = new Date(clean.checkOutDate);
  if (clean.numberOfGuests) clean.numberOfGuests = Number(clean.numberOfGuests);
  if (clean.totalPrice) clean.totalPrice = Number(clean.totalPrice);

  try {
    return await prisma.booking.update({ where: { id }, data: clean });
  } catch {
    return null;
  }
}

export async function deleteBooking(id) {
  try {
    await prisma.booking.delete({ where: { id } });
    return true;
  } catch {
    return false;
  }
}

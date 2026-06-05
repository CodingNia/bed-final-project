import { prisma } from "../prisma/client.js";

export async function getReviews() {
  return prisma.review.findMany();
}

export async function getReviewById(id) {
  return prisma.review.findUnique({ where: { id } });
}

export async function createReview(data) {
  const { userId, propertyId, rating, comment } = data ?? {};

  if (!userId || !propertyId || rating === undefined || !comment) {
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

  return prisma.review.create({
    data: {
      userId,
      propertyId,
      rating: Number(rating),
      comment,
    },
  });
}

export async function updateReview(id, data) {
  const clean = Object.fromEntries(
    Object.entries(data ?? {}).filter(([, v]) => v !== undefined),
  );

  if (clean.rating !== undefined) clean.rating = Number(clean.rating);

  try {
    return await prisma.review.update({ where: { id }, data: clean });
  } catch {
    return null;
  }
}

export async function deleteReview(id) {
  try {
    await prisma.review.delete({ where: { id } });
    return true;
  } catch {
    return false;
  }
}

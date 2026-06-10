import { PrismaClient } from "@prisma/client";
import { readFileSync } from "fs";
import { fileURLToPath } from "url";
import { dirname, join } from "path";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();
const __dirname = dirname(fileURLToPath(import.meta.url));
const dataDir = join(__dirname, "../src/data");

function load(file) {
  return JSON.parse(readFileSync(join(dataDir, file), "utf-8"));
}

async function main() {
  const { users } = load("users.json");
  const { hosts } = load("hosts.json");
  const { properties } = load("properties.json");
  const { bookings } = load("bookings.json");
  const { reviews } = load("reviews.json");

  for (const u of users) {
    await prisma.user.create({
      data: {
        id: u.id,
        username: u.username,
        password: await bcrypt.hash(u.password, 10),
        name: u.name,
        email: u.email,
        phoneNumber: u.phoneNumber,
        role: "USER",
      },
    });
  }

  for (const h of hosts) {
    await prisma.host.create({
      data: {
        id: h.id,
        username: h.username,
        password: await bcrypt.hash(h.password, 10),
        name: h.name,
        email: h.email,
        phoneNumber: h.phoneNumber,
        location: h.aboutMe ?? "",
      },
    });
  }

  for (const p of properties) {
    await prisma.property.create({
      data: {
        id: p.id,
        hostId: p.hostId,
        title: p.title,
        description: p.description,
        location: p.location,
        pricePerNight: p.pricePerNight,
        bedroomCount: p.bedroomCount,
        bathroomCount: p.bathRoomCount,
        maxGuestCount: p.maxGuestCount,
        rating: p.rating,
      },
    });
  }

  for (const b of bookings) {
    await prisma.booking.create({
      data: {
        id: b.id,
        userId: b.userId,
        propertyId: b.propertyId,
        checkInDate: new Date(b.checkinDate),
        checkOutDate: new Date(b.checkoutDate),
        numberOfGuests: b.numberOfGuests,
        totalPrice: b.totalPrice,
        bookingStatus: b.bookingStatus,
      },
    });
  }

  for (const r of reviews) {
    await prisma.review.create({
      data: {
        id: r.id,
        userId: r.userId,
        propertyId: r.propertyId,
        rating: r.rating,
        comment: r.comment,
      },
    });
  }

  console.log("Seeded successfully");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

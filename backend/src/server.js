const { app } = require(".");
const { PrismaClient } = require('@prisma/client');

const PORT = 5454;
const prisma = new PrismaClient();

const connectDb = async () => {
  try {
    await prisma.$connect();
    console.log("Connected to the database");
  } catch (error) {
    console.error("Error connecting to the database", error);
    process.exit(1);
  }
};

app.listen(PORT, async () => {
  await connectDb();
  console.log("ecommerce api listening on port", PORT);
});
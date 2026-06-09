import { PrismaClient } from "@prisma/client"

//single shared database client instance
const prisma = new PrismaClient()

export default prisma

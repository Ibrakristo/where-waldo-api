import express from "express";
import jwt from "jsonwebtoken"
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient()
var router = express.Router();

router.post("/", async (req, res) => {
    const name = req.body.name || "Anonymous";

    const idToken = req.cookies.id;
    const id = jwt.verify(idToken, process.env.SECRET);
    let user = await prisma.user.update({
        where: {
            id: id,
        },
        data: {
            name: name,
        }
    })
    res.sendStatus(200)
})

router.get("/leaderboard", async (req, res) => {
    const users = await prisma.user.findMany({
        orderBy: {
            totalTime: 'asc'
        },
        take: 10
    })
    const result = users.map(user => {
        return { name: user.name, totalTime: user.totalTime }
    })
    res.status(200).json(result);
})

export default router;
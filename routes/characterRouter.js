import express from "express";
import { PrismaClient } from "@prisma/client";
import jwt from 'jsonwebtoken';
const prisma = new PrismaClient();
var router = express.Router();
router.get("/", async (req, res) => {
    if (!req.cookies.id) {
        let user = await prisma.user.create({ data: {} });
        let token = jwt.sign(user.id, process.env.SECRET);
        res.cookie("id", token);

    }
    else {
        let userId = jwt.verify(req.cookies.id, process.env.SECRET)
        let user = await prisma.user.update({
            where: {
                id: userId
            },
            data: {
                createdAt: new Date()
            }
        })
    }
    const characters = await prisma.character.findMany();
    let result = characters.map((character) => {
        return character.name;
    })

    return res.status(200).json(result);
})

router.post("/", async (req, res) => {
    const postedChar = req.body;
    if (Object.keys(postedChar).length < 4) {
        res.sendStatus(404);
        return;
    }
    postedChar.x = Number(postedChar.x);
    postedChar.y = Number(postedChar.y);

    const character = await prisma.character.findUnique({
        where: {
            name: postedChar.name
        }
    });
    function equal(x, y) {
        return x - 0.035 <= y && y <= x + 0.035;
    }
    if (character.name === postedChar.name && equal(character.x, postedChar.x,) && equal(character.y, postedChar.y)) {
        if (postedChar.remainingCharacters.length === 1) {
            const id = jwt.verify(req.cookies.id, process.env.SECRET);

            await prisma.$transaction(async (transactionPrisma) => {
                const user = await transactionPrisma.user.findUnique({
                    where: {
                        id: id
                    }
                })

                await transactionPrisma.user.update({
                    where: {
                        id: id
                    },
                    data: {
                        totalTime: ((new Date()) - user.createdAt) / 1000
                    }
                })
            })

            res.json({ success: true })
        }
        else {
            res.json({ found: true })
        }
    }
    else {
        res.json({ found: false })
    }

})
export default router;

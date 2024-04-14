import prisma from "../db"
import { comparePawsswords, createJWT, hashPassword } from "../modules/auth"

export const createNewUser = async (req, res, next) => {
    try {
        if (!req.body) {
            res.send('No data provided.')
            return
        }
        const user = await prisma.user.create({
            data: {
                username: req.body.username,
                password: await hashPassword(req.body.password)
            }
        })

        const token = await createJWT(user)
        res.json({ token })
    } catch (e) {
        e.type = 'input';
        next(e);
    }
}

export const signin = async (req, res, next) => {
    try {
        const user = await prisma.user.findUnique({
            where: {
                username: req.body.username
            }
        })

        const isValid = await comparePawsswords(req.body.password, user.password)

        if (!isValid) {
            res.status(401).json({
                Message: 'Invalid password.'
            })
            return
        }

        const token = await createJWT(user)
        res.json({ token })
    } catch (e) {
        e.type = 'input';
        next(e);
    }
}
import prisma from "../db";

export const getOneUpdate = async (req, res) => {
    try {
        const update = await prisma.update.findUnique({
            where: {
                id: req.params.id,
            },
        });
        res.json({ data: update });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}
export const getUpdates = async (req, res) => {
    try {
        const products = await prisma.product.findMany(
            {
                where: {
                    belongsToId: req.user.id,
                },
                include: {
                    updates: true,
                }
            },

        );
        const updates = products.flatMap(product => product.updates);

        res.json({ data: updates });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}
export const updateUpdate = async (req, res) => {
    const update = await prisma.update.findUnique({
        where: {
            id: req.params.id,
        },
    });
    if (!update) {
        res.status(404).json({ error: "Update not found" });
        return;
    }
    const product = await prisma.product.findUnique({
        where: {
            id: update.productId,
        },
    });
    if (product.belongsToId !== req.user.id) {
        res.status(403).json({ error: "Unauthorized" });
        return;
    }
    try {
        const updatedUpdate = await prisma.update.update({
            where: {
                id: req.params.id,
            },
            data: req.body,
        });
        res.json({ data: updatedUpdate });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
 }
export const deleteUpdate = async (req, res) => { 
    const update = await prisma.update.findUnique({
        where: {
            id: req.params.id,
        },
    });
    if (!update) {
        res.status(404).json({ error: "Update not found" });
        return;
    }
    const product = await prisma.product.findUnique({
        where: {
            id: update.productId,
        },
    });
    if (product.belongsToId !== req.user.id) {
        res.status(403).json({ error: "Unauthorized" });
        return;
    }
    try {
        await prisma.update.delete({
            where: {
                id: req.params.id,
            },
        });
        res.json({ data: "Update deleted" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}
export const createUpdate = async (req, res) => { 
    const product = await prisma.product.findUnique({
        where: {
            id: req.body.productId,
        },
    });
    if (!product) {
        res.status(404).json({ error: "Product not found" });
        return;
    }
    if (product.belongsToId !== req.user.id) {
        res.status(403).json({ error: "Unauthorized" });
        return;
    }
    try {
        const update = await prisma.update.create({
           data:req.body
        });
        res.json({ data: update });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

import prisma from "../db";

export const getProducts = async (req, res,next) => {
  try {
   const user = await prisma.user.findUnique({
        where:{
        id: req.user.id
        },
        include:{
            products:true
        }
    })
    res.json({data:user.products});
  } catch (e) {
    e.type = 'input';
    next(e);
  }
};

//get single product

export const getOneProduct = async (req, res,next) => {
  try {
    const product = await prisma.product.findFirst({
      where: {
        id: req.params.id,
        // id of currently logged in user
        belongsToId: req.user.id,
      },
    });
    res.json({ data: product });
  } catch (error) {
    error.type = 'input';
    next(error);
  }
};

//create product

export const createProduct = async (req, res,next) => {
  try {
    const product = await prisma.product.create({
      data: {
        name: req.body.name,
        belongsToId: req.user.id,
      },
    });
    res.json({ data: product });
  } catch (error) {
    error.type = 'input';
    next(error);
  }
};

//update product

export const updateProduct = async (req, res,next) => {
  try {
    const product = await prisma.product.update({
      where: {
        id_belongsToId: {
            id: req.params.id,
            belongsToId: req.user.id,

        }
      },
      data: {
        name: req.body.name,
      },
    });
    res.json({ data: product });
  } catch (error) {
    error.type = 'input';
    next(error);
  }
};

//delete product
export const deleteProduct = async (req, res,next) => {
  try {
    // Delete the associated updates
    await prisma.update.deleteMany({
      where: {
        productId: req.params.id,
      },
    });

    // Delete the product
    const product = await prisma.product.delete({
      where: {
        id_belongsToId: {
          id: req.params.id,
          belongsToId: req.user.id,
        },
      },
    });

    res.json({ data: product });
  } catch (error) {
    error.type = 'input';
    next(error);
  }
};

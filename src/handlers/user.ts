import prisma from "../db"
import { comparePawsswords, createJWT, hashPassword } from "../modules/auth"

export const createOperator = async (req, res, next) => {
  try {
    const user = await prisma.operator.create({
      data: {
        name: req.body.name,
        email: req.body.email,
        password: await hashPassword(req.body.password),
      },
      select: {
        id: true,
        name: true,
        email: true,
        // Don't include the password
      },
    });

    res.json(user);
  } catch (e) {
    e.type = 'input';
    next(e)
  }
}




export const deleteOperator = async (req, res, next) => {
  try {
    const user = await prisma.operator.delete({
      where: {
        id: parseInt(req.params.id),
      },
      select: {
        id: true,
        name: true,
        email: true,
      },
    });

    res.json(user);
  } catch (e) {
    next(e);
  }
};

export const signin = async (req, res, next) => {
  try {
    const user = await prisma.operator.findUnique({
      where: {
        email: req.body.email
      }
    })

    if (!user) {
      res.status(401).json({ message: 'No user found with this email.' });
      return;
    }

    const passwordIsValid = await comparePawsswords(req.body.password, user.password);

    if (!passwordIsValid) {
      res.status(401).json({ message: 'Password is incorrect.' });
      return;
    }

    const token = await createJWT({ id: user.id, username: user.email })
    res.json({ token })
  } catch (e) {
    e.type = 'input';
    next(e);
  }
}

export const adminSignin = async (req, res, next) => {
  try {
    const user = await prisma.admin.findUnique({
      where: {
        email: req.body.email
      }
    })

    if (!user) {
      res.status(401).json({ message: 'No adnub found with this email.' });
      return;
    }

    const passwordIsValid = await comparePawsswords(req.body.password, user.password);

    if (!passwordIsValid) {
      res.status(401).json({ message: 'Password is incorrect.' });
      return;
    }

    const token = await createJWT({ id: user.id, username: user.email })
    res.json({ token })
  } catch (e) {
    e.type = 'input';
    next(e);
  }
}







export async function getAllOperators(req, res, next) {
  try {
    const users = await prisma.operator.findMany({
      select: {
        id: true,
        name: true,
        email: true,
      },
    });
    res.json(users);
  } catch (err) {
    next(err);
  }
}
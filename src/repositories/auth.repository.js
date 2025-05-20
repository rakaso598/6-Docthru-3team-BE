import prisma from "../prisma/client.prisma.js";

async function save(user, hashedPassword) {
  return await prisma.user.create({
    data: {
      email: user.email,
      nickname: user.nickname,
      hashedPassword: hashedPassword,
      provider: "google",
    },
  });
}

async function getByEmail(email) {
  const getUser = await prisma.user.findUnique({
    where: {
      email,
    },
  });

  if (!getUser) throw new Error(`Cannot found user`);

  return getUser;
}

async function findUserById(userId) {
  const user = await prisma.user.findUnique({
    where: {
      id: userId,
    },
  });

  if (!user) throw new Error("there's no user you found");

  //디버깅
  console.log("유저 찾음");

  return user;
}

export default {
  save,
  getByEmail,
  findUserById,
};

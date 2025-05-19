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

export default {
  save,
  getByEmail,
};

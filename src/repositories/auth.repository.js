import prisma from "../prisma/client.prisma.js";

async function saveUser(user, hashedPassword) {
  return await prisma.user.create({
    data: {
      email: user.email,
      nickname: user.nickname,
      hashedPassword: hashedPassword,
    },
  });
}

async function updateUser(id, data) {
  return await prisma.user.update({
    where: {
      id,
    },
    data: data,
  });
}

async function findUserByEmail(email) {
  return await prisma.user.findUnique({
    where: {
      email,
    },
  });
}

async function findUserByNickname(nickname) {
  return await prisma.user.findFirst({
    where: {
      nickname,
    },
  });
}
async function findUserById(userId) {
  return await prisma.user.findUnique({
    where: {
      id: userId,
    },
  });
}

export default {
  saveUser,
  updateUser,
  findUserByEmail,
  findUserByNickname,
  findUserById,
};

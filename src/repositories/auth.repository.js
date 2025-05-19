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

export default {
  save,
};

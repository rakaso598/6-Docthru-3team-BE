import authService from "../services/auth.service.js";

export const createUser = async (req, res, next) => {
  try {
    const newUser = await authService.create(req.body);

    return res.json(newUser);
  } catch (error) {
    next(error);
  }
};

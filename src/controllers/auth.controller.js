import authService from "../services/auth.service.js";

export const createUser = async (req, res, next) => {
  try {
    const newUser = await authService.create(req.body);

    return res.json(newUser);
  } catch (error) {
    next(error);
  }
};

export const getUser = async (req, res, next) => {
  try {
    const user = await authService.getByEmail(req.body);

    return res.json(user);
  } catch (error) {
    next(error);
  }
};

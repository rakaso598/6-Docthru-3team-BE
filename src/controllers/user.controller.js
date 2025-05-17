const users = [
  { id: 1, name: "Alice", email: "alice@example.com" },
  { id: 2, name: "Bob", email: "bob@example.com" },
];
let nextId = 3;

export const getAllUsers = (req, res) => {
  res.status(200).json(users);
};

export const getUserById = (req, res) => {
  const id = parseInt(req.params.id);
  const user = users.find((u) => u.id === id);

  if (user) {
    res.status(200).json(user);
  } else {
    res.status(404).json({ message: "User not found" });
  }
};

export const createUser = (req, res) => {
  const { name, email } = req.body;
  if (!name || !email) {
    return res.status(400).json({ message: "Name and email are required" });
  }

  const newUser = { id: nextId++, name, email };
  users.push(newUser);
  res.status(201).json(newUser);
};

export const updateUser = (req, res) => {
  const id = parseInt(req.params.id);
  const { name, email } = req.body;
  const userIndex = users.findIndex((u) => u.id === id);

  if (userIndex !== -1) {
    users[userIndex] = { ...users[userIndex], name, email };
    res.status(200).json(users[userIndex]);
  } else {
    res.status(404).json({ message: "User not found" });
  }
};

export const deleteUser = (req, res) => {
  const id = parseInt(req.params.id);
  const initialLength = users.length;
  users = users.filter((u) => u.id !== id);

  if (users.length < initialLength) {
    res.status(204).send(); // No Content (성공적으로 삭제됨)
  } else {
    res.status(404).json({ message: "User not found" });
  }
};

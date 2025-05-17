const works = [
  {
    id: 1,
    title: "UI 디자인",
    description: "웹사이트 메인 페이지 UI 디자인",
    projectId: 101,
    status: "진행 중",
  },
  {
    id: 2,
    title: "API 개발",
    description: "사용자 인증 및 권한 부여 API 개발",
    projectId: 102,
    status: "완료",
  },
];
let nextId = 3;

export const getAllWorks = (req, res) => {
  res.status(200).json(works);
};

export const getWorkById = (req, res) => {
  const id = parseInt(req.params.id);
  const work = works.find((w) => w.id === id);

  if (work) {
    res.status(200).json(work);
  } else {
    res.status(404).json({ message: "Work not found" });
  }
};

export const createWork = (req, res) => {
  const { title, description, projectId, status } = req.body;
  if (!title || !description || !projectId || !status) {
    return res.status(400).json({
      message: "Title, description, projectId, and status are required",
    });
  }

  const newWork = { id: nextId++, title, description, projectId, status };
  works.push(newWork);
  res.status(201).json(newWork);
};

export const updateWork = (req, res) => {
  const id = parseInt(req.params.id);
  const { title, description, projectId, status } = req.body;
  const workIndex = works.findIndex((w) => w.id === id);

  if (workIndex !== -1) {
    works[workIndex] = {
      ...works[workIndex],
      title,
      description,
      projectId,
      status,
    };
    res.status(200).json(works[workIndex]);
  } else {
    res.status(404).json({ message: "Work not found" });
  }
};

export const deleteWork = (req, res) => {
  const id = parseInt(req.params.id);
  const initialLength = works.length;
  works = works.filter((w) => w.id !== id);

  if (works.length < initialLength) {
    res.status(204).send(); // No Content
  } else {
    res.status(404).json({ message: "Work not found" });
  }
};

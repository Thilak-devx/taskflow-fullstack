const sanitizeTaskPayload = (payload = {}) => {
  const nextPayload = { ...payload };

  if (typeof nextPayload.title === "string") {
    nextPayload.title = nextPayload.title.trim();
  }

  if (typeof nextPayload.description === "string") {
    nextPayload.description = nextPayload.description.trim();
  }

  if (nextPayload.dueDate === "" || nextPayload.dueDate === undefined) {
    nextPayload.dueDate = null;
  }

  return nextPayload;
};

const sanitizeUserPayload = (payload = {}) => {
  const nextPayload = { ...payload };

  if (typeof nextPayload.name === "string") {
    nextPayload.name = nextPayload.name.trim();
  }

  if (typeof nextPayload.email === "string") {
    nextPayload.email = nextPayload.email.trim().toLowerCase();
  }

  return nextPayload;
};

module.exports = {
  sanitizeTaskPayload,
  sanitizeUserPayload
};

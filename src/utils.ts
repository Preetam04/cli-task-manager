import { Status, type Task } from "./types";

function createTask(title: string): Task {
  return {
    id: crypto.randomUUID(),
    title: title
      .split(" ")
      .filter((ele) => ele !== "")
      .join(" "),
    status: Status.PENDING,
    createdAt: new Date(),
  };
}

export { createTask };

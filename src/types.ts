enum Status {
  PENDING = "pending",

  COMPLETED = "completed",
}

interface Task {
  id: string;
  title: string;
  status: Status;
  createdAt: Date;
}

export type { Task };
export { Status };

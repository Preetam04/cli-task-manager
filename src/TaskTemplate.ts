import { Status } from "./types";

class TaskTemplate {
  private id: string;
  private title: string;
  private status: Status;
  private createdAt: Date;

  constructor(title: string) {
    this.id = crypto.randomUUID();
    this.title = title;
    this.status = Status.PENDING;
    this.createdAt = new Date();
  }

  public task() {
    const task = {
      id: this.id,
      title: this.title,
      status: this.status,
      createdAt: this.createdAt,
    };
  }
}

export { TaskTemplate };

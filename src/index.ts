import fs from "fs";
import { Command } from "commander";
import chalk from "chalk";
import { TaskTemplate } from "./TaskTemplate";
import { Status, type Task } from "./types";

const program = new Command();

program
  .command("add")
  .argument("<title>", "Title of the Task")
  .description("Add a new task")
  .action(async (title) => {
    if (title.trim() === "") {
      console.log(chalk.red("Error: Task title cannot be empty."));
      return;
    }

    const newTask = new TaskTemplate(title);
    const prevData = fs.readFileSync("tasks.json", "utf-8");

    fs.writeFile(
      "tasks.json",
      JSON.stringify([...JSON.parse(prevData), newTask]),
      (err) => {
        if (err) {
          console.log(chalk.red("Error Adding the task"));
          return;
        } else {
          console.log(chalk.green("Task added successfully"));
          return;
        }
      },
    );
  });

program
  .command("list")
  .description("List all tasks")
  .action(() => {
    const data = fs.readFileSync("./tasks.json", "utf-8");

    const tasks = JSON.parse(data);
    console.log(chalk.green("All tasks"));
    console.table(tasks, ["id", "title", "status", "createdAt"]);
  });

program
  .command("delete")
  .argument("<id>", "task id to delete")
  .description("Delete a task by ID")
  .action((id) => {
    const data = fs.readFileSync("./tasks.json", "utf-8");

    const tasks = JSON.parse(data);

    const taskExists = tasks.filter((task: Task) => task.id === id);

    if (taskExists.length === 0) {
      console.log(chalk.red("Task does not exists!"));
      return;
    }

    const updatedTasks = tasks.filter((task: Task) => task.id !== id);

    fs.writeFile("tasks.json", JSON.stringify(updatedTasks), (err) => {
      if (err) {
        console.log(chalk.red("Error deleting task"));
      } else {
        console.log(chalk.green("Task deleted sucessfuly"));
      }

      return;
    });
  });

program
  .command("show-task")
  .argument("<id>", "Id of the task")
  .description("Get Task with particular ID")
  .action((id: string) => {
    const data = fs.readFileSync("./tasks.json", "utf-8");
    const tasks = JSON.parse(data);
    const taskWithId = tasks.filter((task: Task) => task.id === id);

    if (taskWithId.length === 0) {
      console.log(chalk.red(`Task with id: ${id} does not exists.`));
      return;
    } else {
      console.table(taskWithId, ["id", "title", "status", "createdAt"]);
      return;
    }
  });

program
  .command("update-task-title")
  .description("Update Task Title.")
  .argument("<id>", "Id of the task")
  .argument("<title>", "New title of the Task")
  .action((id: string, title: string) => {
    const data = fs.readFileSync("./tasks.json", "utf-8");
    const tasks = JSON.parse(data);

    const taskWithId = tasks.filter((task: Task) => task.id === id);
    const alltasksWithoutId = tasks.filter((task: Task) => task.id !== id);

    if (taskWithId.length === 0) {
      console.log(chalk.red(`Task with id ${id} does not exists`));
      return;
    }

    const updatedTask = { ...taskWithId[0], title };

    const allTasks = [...alltasksWithoutId, updatedTask];

    fs.writeFile("./tasks.json", JSON.stringify(allTasks), (err) => {
      if (err) {
        console.log(chalk.red("Error updating the tasks"));
        return;
      } else {
        console.log(chalk.green("Task updated successfully"));
        return;
      }
    });
  });

program
  .command("task-completed")
  .description("Update Task Title.")
  .argument("<id>", "Id of the task")
  .action((id: string, title: string) => {
    const data = fs.readFileSync("./tasks.json", "utf-8");
    const tasks = JSON.parse(data);

    const taskWithId = tasks.filter((task: Task) => task.id === id);
    const alltasksWithoutId = tasks.filter((task: Task) => task.id !== id);

    if (taskWithId.length === 0) {
      console.log(chalk.red(`Task with id ${id} does not exists`));
      return;
    }

    if (taskWithId[0].status === "completed") {
      console.log(chalk.yellow("Task already completed."));
      return;
    }

    const updatedTask = { ...taskWithId[0], status: Status.COMPLETED };

    const allTasks = [...alltasksWithoutId, updatedTask];

    fs.writeFile("./tasks.json", JSON.stringify(allTasks), (err) => {
      if (err) {
        console.log(chalk.red("Error updating the tasks"));
        return;
      } else {
        console.log(chalk.green("Task status updated successfully"));
        return;
      }
    });
  });

program
  .command("get-all-pending-task")
  .description("Get all pending task")
  .action(() => {
    const data = fs.readFileSync("./tasks.json", "utf-8");
    const tasks = JSON.parse(data);

    const pendingTasks = tasks.filter(
      (task: Task) => task.status === Status.PENDING,
    );

    console.table(pendingTasks, ["id", "title", "status", "createdAt"]);
  });

program
  .command("get-all-completed-task")
  .description("Get all completed task")
  .action(() => {
    const data = fs.readFileSync("./tasks.json", "utf-8");
    const tasks = JSON.parse(data);

    const completedTasks = tasks.filter(
      (task: Task) => task.status === Status.COMPLETED,
    );

    console.table(completedTasks, ["id", "title", "status", "createdAt"]);
  });

program.parse();

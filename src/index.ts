import chalk from "chalk";
import { Command } from "commander";
import fs from "fs";
import { Status, type Task } from "./types";
import { createTask } from "./utils";

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

    const newTask = createTask(title);
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
  .command("mark-completed")
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
  .command("list")
  .description("List all task ")
  .option("-p, --pending", "List all pending tasks")
  .option("-c, --completed", "List all completed tasks")
  .action(async (options) => {
    const data = fs.readFileSync("./tasks.json", "utf-8");

    const tasks = JSON.parse(data);

    if (options?.completed && !options?.pending) {
      console.table(
        tasks.filter((task: Task) => task.status === Status.COMPLETED),
        ["id", "title", "status", "createdAt"],
      );

      return;
    }

    if (options?.pending && !options?.completed) {
      console.table(
        tasks.filter((task: Task) => task.status === Status.PENDING),
        ["id", "title", "status", "createdAt"],
      );

      return;
    }

    console.table(tasks, ["id", "title", "status", "createdAt"]);
  });

program.parse();

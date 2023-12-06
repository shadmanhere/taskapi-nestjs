import { Injectable } from '@nestjs/common';
import { Task, TaskStatus } from './task.model';
import * as uuid from 'uuid';
import { CreateTaskDto } from './dto/create-task.dto';

@Injectable()
export class TasksService {
  private tasks: Task[] = [];

  getAllTasks(): Task[] {
    return this.tasks;
  }
  getTaskById(taskId: string): Task {
    return this.tasks.find((task) => task.id === taskId);
  }

  createTask(createTaskDto: CreateTaskDto): Task {
    const { title, description } = createTaskDto;
    const task: Task = {
      id: uuid.v1(),
      title,
      description,
      status: TaskStatus.OPEN,
    };
    this.tasks.push(task);
    return task;
  }

  updateTaskStatus(taskId: string, status: TaskStatus): Task {
    const task = this.getTaskById(taskId);
    task.status = status;
    return task;
  }

  deleteTaskById(taskId: string): void {
    this.tasks = this.tasks.filter((task) => task.id !== taskId);
  }
}

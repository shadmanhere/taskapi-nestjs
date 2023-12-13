import { Injectable, NotFoundException } from '@nestjs/common';
import { Task } from './task.entity';
import { TaskStatus } from './task-status.enum';
import { CreateTaskDto } from './dto/create-task.dto';
import { GetTasksFilterDto } from './dto/get-task-filter.dto';
import { TaskRepository } from './task.repository';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class TasksService {
  constructor(
    @InjectRepository(TaskRepository)
    private taskRepository: TaskRepository,
  ) {}
  async getAllTasks(): Promise<Task[]> {
    return await this.taskRepository.find();
  }
  // getTasksWithFilter(tasksfilterDto: GetTasksFilterDto): Task[] {
  //   const { status, search } = tasksfilterDto;
  //   let tasks = this.getAllTasks();
  //   if (status) {
  //     tasks = tasks.filter((task) => task.status === status);
  //   }
  //   if (search) {
  //     tasks = tasks.filter((task) => {
  //       if (task.title.includes(search) || task.description.includes(search)) {
  //         return true;
  //       }
  //       return false;
  //     });
  //   }
  //   return tasks;
  // }
  async getTaskById(taskId: number): Promise<Task> {
    const found = await this.taskRepository.findOne({ where: { id: taskId } });
    if (!found) {
      throw new NotFoundException(`Task with ID "${taskId}" not found`);
    }
    return found;
  }
  async createTask(createTaskDto: CreateTaskDto): Promise<Task> {
    const { title, description } = createTaskDto;
    const task = {
      title,
      description,
      status: TaskStatus.OPEN,
    };
    const createTask = await this.taskRepository.save(task);
    return createTask;
  }
  async updateTaskStatus(taskId: number, status: TaskStatus): Promise<Task> {
    const task: Promise<Task> = this.getTaskById(taskId);
    (await task).status = status;
    return task;
  }

  async deleteTaskById(taskId: number): Promise<void> {
    const found = this.getTaskById(taskId);
    await this.taskRepository.delete((await found).id);
  }
}

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
    return await this.taskRepository.createTask(createTaskDto);
  }
  async updateTaskStatus(taskId: number, status: TaskStatus): Promise<Task> {
    const task = await this.getTaskById(taskId);
    task.status = status;
    await task.save();
    return task;
  }

  async deleteTaskById(taskId: number): Promise<void> {
    const result = await this.taskRepository.delete(taskId);
    if (result.affected === 0) {
      throw new NotFoundException(`Task with ID "${taskId}" not found`);
    }
  }
}

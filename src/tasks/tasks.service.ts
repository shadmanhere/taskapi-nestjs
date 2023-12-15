import { Injectable, NotFoundException } from '@nestjs/common';
import { Task } from './task.entity';
import { TaskStatus } from './task-status.enum';
import { CreateTaskDto } from './dto/create-task.dto';
import { GetTasksFilterDto } from './dto/get-task-filter.dto';
import { TaskRepository } from './task.repository';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/auth/user.entity';

@Injectable()
export class TasksService {
  constructor(
    @InjectRepository(TaskRepository)
    private taskRepository: TaskRepository,
  ) {}
  async getTasks(filterDto: GetTasksFilterDto): Promise<Task[]> {
    return this.taskRepository.getTasks(filterDto);
  }

  async getTaskById(taskId: number): Promise<Task> {
    const found = await this.taskRepository.findOne({ where: { id: taskId } });
    if (!found) {
      throw new NotFoundException(`Task with ID "${taskId}" not found`);
    }
    return found;
  }

  async createTask(createTaskDto: CreateTaskDto, user: User): Promise<Task> {
    return await this.taskRepository.createTask(createTaskDto, user);
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

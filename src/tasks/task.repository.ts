import { Injectable } from '@nestjs/common';
import { Task } from './task.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class TaskRepository extends Repository<Task> {
  constructor(
    @InjectRepository(Task)
    private taskRepository: Repository<Task>,
  ) {
    super(
      taskRepository.target,
      taskRepository.manager,
      taskRepository.queryRunner,
    );
  }

  // custom methods
  async findByTiTle(title: string): Promise<Task> {
    return await this.taskRepository.findOneBy({ title });
  }
}

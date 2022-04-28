import { Injectable, NotFoundException } from '@nestjs/common';
import { TaskStatus } from './task-status.enum';
import { CreateTaskDto } from './dto/create-task.dto';
import { GetTaskFilterDto } from './dto/get-tasks-filter.dto';
import { TaskRepository } from './task.repositry';
import { InjectRepository } from '@nestjs/typeorm';
import { Task } from './task.entity';
import { User } from '../auth/user.entity';

@Injectable()
export class TasksService {

    constructor(
        @InjectRepository(TaskRepository)
        private repo: TaskRepository,
    ) { }

    async getTaskById(id: string, user: User): Promise<Task> {
        const found = await this.repo.findOne({ where: { id, user } });
        if (!found) {
            throw new NotFoundException(`Task with id: "${id}" not found`);
        }
        return found;
    }

    getTasks(filterDto: GetTaskFilterDto, user: User): Promise<Task[]> {
        return this.repo.getTasks(filterDto, user);
    }

    createTask(createTaskDto: CreateTaskDto, user: User): Promise<Task> {
        return this.repo.createTask(createTaskDto, user);
    }

    async updateTask(id: string, status: TaskStatus, user: User): Promise<Task> {
        const task = await this.getTaskById(id, user);
        task.status = status;
        await this.repo.save(task);
        return task;
    }

    async deleteTaskById(id: string, user: User): Promise<void> {
        const result = await this.repo.delete({ id, user });
        if (result.affected === 0) {
            throw new NotFoundException(`Task with ID ${id} not found.`);
        }
    }
}

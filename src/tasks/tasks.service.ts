import { Injectable, NotFoundException } from '@nestjs/common';
import { TaskStatus } from './task-status.enum';
import { CreateTaskDto } from './dto/create-task.dto';
import { GetTaskFilterDto } from './dto/get-tasks-filter.dto';
import { TaskRepository } from './task.repositry';
import { InjectRepository } from '@nestjs/typeorm';
import { Task } from './task.entity';

@Injectable()
export class TasksService {

    constructor(
        @InjectRepository(TaskRepository)
        private repo: TaskRepository,
    ) { }

    async getTaskById(id: string): Promise<Task> {
        const found = await this.repo.findOne(id);
        if (!found) {
            throw new NotFoundException(`Task with id: "${id}" not found`);
        }
        return found;
    }

    getTasks(filterDto: GetTaskFilterDto): Promise<Task[]> {
        return this.repo.getTasks(filterDto);
    }

    createTask(createTaskDto: CreateTaskDto): Promise<Task> {
        return this.repo.createTask(createTaskDto);
    }

    async updateTask(id: string, status: TaskStatus): Promise<Task> {
        const task = await this.getTaskById(id);
        task.status = status;
        await this.repo.save(task);
        return task;
    }

    async deleteTaskById(id: string): Promise<void> {
        const result = await this.repo.delete(id);
        if (result.affected === 0) {
            throw new NotFoundException(`Task with ID ${id} not found.`);
        }
    }
}

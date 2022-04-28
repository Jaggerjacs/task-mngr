import { Body, Controller, Delete, Get, Param, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { TasksService } from './tasks.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { GetTaskFilterDto } from './dto/get-tasks-filter.dto';
import { UpdateTaskStatusDto } from './dto/update-task-status.dto';
import { Task } from './task.entity';
import { AuthGuard } from '@nestjs/passport';

@Controller('tasks')
@UseGuards(AuthGuard())
export class TasksController {

    constructor(private service: TasksService) { }

    @Get()
    getTasks(@Query() filterDto: GetTaskFilterDto): Promise<Task[]> {
        return this.service.getTasks(filterDto);
    }

    @Get('/:id')
    getTask(@Param('id') id: string): Promise<Task> {
        return this.service.getTaskById(id);
    }

    @Post()
    createTask(@Body() createTaskDto: CreateTaskDto): Promise<Task> {
        return this.service.createTask(createTaskDto);
    }

    @Patch('/:id/status')
    updateTask(@Param('id') id: string, @Body() updateTaskStatusDto: UpdateTaskStatusDto): Promise<Task> {
        return this.service.updateTask(id, updateTaskStatusDto.status);
    }

    @Delete('/:id')
    deleteTask(@Param('id') id: string): Promise<void> {
        return this.service.deleteTaskById(id);
    }
}

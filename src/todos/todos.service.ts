import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { FindOptionsWhere, ObjectLiteral, Repository } from 'typeorm';
import User from '../users/entities/user.entity';
import CreateTodoDto from './dto/create-todo.dto';
import Todo from './entity/todo.entity';

type todoPaginateParams = {
  skip?: number;
  take?: number;
  where?: ObjectLiteral | FindOptionsWhere<User> | FindOptionsWhere<User>[];
};

@Injectable()
export class TodosService {
  constructor(@InjectRepository(Todo) private todoRepo: Repository<Todo>) {}

  todo(id: number): Promise<Todo> {
    return this.todoRepo.findOne({
      where: {
        id: id,
      },
    });
  }

  getUsersTodos(
    userId: number,
    todoParams?: todoPaginateParams,
  ): Promise<Todo[]> {
    return this.todoRepo.find({
      where: {
        userId: userId,
      },
      skip: todoParams.skip,
      take: todoParams.take,
    });
  }

  createTodo(data: CreateTodoDto): Promise<Todo> {
    const todo = this.todoRepo.create(data);
    return this.todoRepo.save(todo);
  }

  updateTodo(id: number, data: Partial<Todo>): Promise<Todo> {
    return this.todoRepo.save({
      id,
      data,
    });
  }

  async deleteTodo(id: number): Promise<void> {
    await this.todoRepo.delete(id);
  }
}

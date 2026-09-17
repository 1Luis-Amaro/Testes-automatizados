    import { DrizzleTodoRepository } from "./drizzle-todo.repository";
import { TodoRepository } from "./todo.contract.repository";
import { drizzleDatabase } from "@/db/drizzle";

export const todoRepository: TodoRepository = new DrizzleTodoRepository(drizzleDatabase.db) //instancio o repositorio do drizzle para usar seus metodos e coloco essa const com o type TodoRepository 
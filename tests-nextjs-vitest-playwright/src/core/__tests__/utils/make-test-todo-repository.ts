import { DrizzleTodoRepository } from "@/core/todo/repositores/drizzle-todo.repository";
import { Todo } from "@/core/todo/schemas/todo.contract";
import { drizzleDatabase } from "@/db/drizzle";
import { eq } from "drizzle-orm";

export async function makeTestTodoRepository() {
    const { db, todoTable } = drizzleDatabase
    const repository = new DrizzleTodoRepository(db)
    const insertTodoDb = () => db.insert(todoTable)
    const deleteTodoNoWhere = () => db.delete(todoTable) 
    const deleteTodoDb = (id: string) => { db.delete(todoTable).where(eq(todoTable.id, id)) }

    return {
        repository,
        insertTodoDb,
        deleteTodoNoWhere,
        deleteTodoDb
    }

}

export const insertTestTodos = async () => {
    const { insertTodoDb } = await makeTestTodoRepository()
    const todos = makeTestTodos()

    await insertTodoDb().values(todos);

    return todos;
}

export const makeTestTodos = () => {
    return Array.from({ length: 5 }).map((_, index) => {
        const newTodo = {
            id: index.toString(),
            description: `Todo ${index}`,
            createdAt: `date ${index}`,
        }
        return newTodo
    })
}
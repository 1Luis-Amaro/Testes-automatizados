import { drizzleDatabase } from "@/db/drizzle"
import { DrizzleTodoRepository } from "./drizzle-todo.repository"
import { insertTestTodos, makeTestTodoRepository } from "@/core/__tests__/utils/make-test-todo-repository"


describe('DrizzleTodoRepository (integration)', () => {
    beforeEach(async () => {
        const { deleteTodoNoWhere } = await makeTestTodoRepository();
        await deleteTodoNoWhere();
    });
    describe('findAll', () => {
        test('deve retornar um array vazio se a tabela estiver limpa', async () => {
            const { repository } = await makeTestTodoRepository();
            const result = await repository.findAll();
            expect(result).toStrictEqual([]);
            expect(result).toHaveLength(0);
        });
        test('deve retornar todos os TODOs em ordem decrescente', async () => {
            const { repository } = await makeTestTodoRepository();
            await insertTestTodos();
            const result = await repository.findAll();
            expect(result[0].createdAt).toBe('date 4');
            expect(result[1].createdAt).toBe('date 3');
            expect(result[2].createdAt).toBe('date 2');
            expect(result[3].createdAt).toBe('date 1');
            expect(result[4].createdAt).toBe('date 0');
        })
    })

    describe('create', () => {
        test('cria um TODO se os dados estão validos', async () => { })
        test('falha se houver uma descrição igual na tabela', async () => { })
        test('falha se houver uma ID igual na tabela', async () => { })
    })

    describe('delete', () => {
        test('apaga um todo se ele existir', async () => { })
        test('falha ao apagar se o todo não existir', async () => { })
    })
})



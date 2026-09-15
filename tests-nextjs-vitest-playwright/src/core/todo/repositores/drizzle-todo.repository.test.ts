import { drizzleDatabase } from "@/db/drizzle"
import { DrizzleTodoRepository } from "./drizzle-todo.repository"

describe('DrizzleTodoRepository (integration', () => {
    describe('findAll', () => {
        test('deve retornar um array vazio se a tabela estiver limpa', async() => {
            const repository = new DrizzleTodoRepository(drizzleDatabase.db)
            expect(await repository.findAll()).toStrictEqual([])
            expect(await repository.findAll()).toHaveLength(1)
        })
        test('deve retornar todos os TODOs em ordem decrescente', async() => {})

        describe('create', () => {
            test('cria um TODO se os dados estão validos', async() => {})
            test('falha se houver uma descrição igual na tabela', async() => {})
            test('falha se houver uma ID igual na tabela', async() => {})
        })

        describe('delete', () => {
            test('apaga um todo se ele existir', async () => {})
            test('falha ao apagar se o todo não existir', async () => {})
        })
    })

    
})
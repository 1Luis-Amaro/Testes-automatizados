import { makeTestTodoRepository } from "@/core/__tests__/utils/make-test-todo-repository";
import { deleteTodoUseCase } from "./delete-todo.usecase";
describe('createTodoUseCase (integration)', () => { // Descrição do bloco de teste (teste de integração do caso de uso)
  beforeEach(async () => { // Antes de CADA teste, quero fazer o seguinte:
    const { deleteTodoNoWhere } = await makeTestTodoRepository(); // Pego a função de delete sem where (excluir todos os dados do banco)
    await deleteTodoNoWhere(); // Chamo a função com await (operação assíncrona). Limpa o banco antes de cada teste, garantindo isolamento
  });

  afterAll(async () => { // Depois de TODOS os testes, quero fazer o seguinte:
    const { deleteTodoNoWhere } = await makeTestTodoRepository(); // Pego a função de delete sem where
    await deleteTodoNoWhere(); // Chamo a função com await. Limpa o banco depois de todos os testes, garantindo que não fique lixo
  });

  test('deve retornar erro se o id for invalid', async () => {
    const result = await deleteTodoUseCase('')

    expect(result).toStrictEqual({
      errors: ['ID inválido'],
      success: false,
    })

  })

  test('deve retornar sucesso se o todo existe na base de dados', async () => {
    const { insertTodoDb, todos } = await makeTestTodoRepository()
    await insertTodoDb().values(todos)

    const result = await deleteTodoUseCase(todos[0].id)

    expect(result).toStrictEqual({
      success: true,
      todo: todos[0]
    })



  })
  test('deve retornar erro se o todo não existe na base de dados', async () => {
    const result = await deleteTodoUseCase('this-does-not-exist')

    expect(result).toStrictEqual({
      errors: ['Todo não existe'],
      success: false
    })



  })


})

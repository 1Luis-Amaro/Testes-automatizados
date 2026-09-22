import { deleteTodoAction } from "./delete-todo.action" // Importo a Server Action de deleção de tarefa no servidor
import { makeTestTodoMakeMocks } from "@/core/__tests__/utils/make-test-todo-mocks" // Importo a função que cria os mocks para os testes

vi.mock('next/cache', () => { // Substituo o módulo real 'next/cache' por uma versão FALSA (mock) que eu controlo
  return { // Retorno o que quero que o módulo falso tenha
    revalidatePath: vi.fn() // Crio uma função vazia (mock) que NÃO executa a lógica real, apenas registra chamadas
  }
})

describe('deleteTodoAction (unit)', () => { // Descrição do bloco de testes (teste unitário da Server Action de deleção)
  test('deve chamar o deleteTodoUseCase com os valores corretos', async () => { // Este teste verifica se o caso de uso é chamado com o ID correto
    const { deleteTodoUseCaseSpy } = makeTestTodoMakeMocks() // Pego o espião que monitora a função de caso de uso
    const fakeId = "any-id" // Crio um ID falso para ser usado no teste
    await deleteTodoAction(fakeId) // Chamo a Server Action de deleção passando o ID falso

    expect(deleteTodoUseCaseSpy).toHaveBeenCalledExactlyOnceWith(fakeId) // Espero que o espião tenha sido chamado EXATAMENTE 1 VEZ com o ID correto
  })

  test('deve chamar o revalidatePatch se o usecase retornar sucesso', async () => { // Este teste verifica se o revalidatePath é chamado quando o caso de uso tem sucesso
    const { revalidatePathMocked } = makeTestTodoMakeMocks() // Pego a mock da função que invalida o cache
    const fakeId = "any-id" // Passo um ID falso
    await deleteTodoAction(fakeId) // Chamo a Server Action de deleção passando o ID falso

    expect(revalidatePathMocked).toHaveBeenCalledExactlyOnceWith('/') // Espero que o mock do revalidatePath tenha sido chamado EXATAMENTE 1 VEZ com '/'
  })

  test('deve retornar o mesmo valor do usecase de sucesso', async () => { // Este teste verifica se o retorno da Server Action é o mesmo do caso de uso (sucesso)
    const { successResult } = makeTestTodoMakeMocks() // Pego a constante que tem o resultado de sucesso da minha mock
    const fakeId = "any-id" // Passo um ID falso
    const result = await deleteTodoAction(fakeId) // Chamo a Server Action de deleção e guardo o resultado

    expect(result).toStrictEqual(successResult) // Espero que o resultado da deleção seja estritamente igual à const de sucesso que criei no teste
  })

  test('deve retornar o mesmo valor do usecase em caso de erro', async () => { // Este teste verifica se o retorno da Server Action é o mesmo do caso de uso (erro)
    const { deleteTodoUseCaseSpy, errorResult } = makeTestTodoMakeMocks() // Pego o espião do caso de uso e a const que tem um resultado falho
    const fakeId = "any-id" // Passo um ID falso

    deleteTodoUseCaseSpy.mockResolvedValue(errorResult) // Altero o retorno do espião: quando a função for chamada, retorne errorResult em vez do valor real
    const result = await deleteTodoAction(fakeId) // Chamo a Server Action de deleção e guardo o resultado

    expect(result).toStrictEqual(errorResult) // Espero que o resultado da deleção seja estritamente igual à const de erro que criei no teste
  })
})
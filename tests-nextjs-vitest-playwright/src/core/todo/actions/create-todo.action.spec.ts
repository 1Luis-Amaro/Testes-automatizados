
import { makeTestTodoMakeMocks } from "@/core/__tests__/utils/make-test-todo-mocks"
import { createTodoAction } from "./create-todo.action" //importo a server action de criação de tarefa no servidor

vi.mock('next/cache', () => { // Substituo o módulo real 'next/cache' por uma versão FALSA (mock) que eu controlo
    return { // Retorno o que quero que o módulo falso tenha
        revalidatePath: vi.fn() // Crio uma função vazia (mock) que NÃO executa a lógica real, apenas registra chamadas
    }
})


describe('createTodoAction (unit)', () => { //descrição desse bloco de testes, coloquei também que vai ser um teste unitario
    test('deve chamar o createTodoUseCase com os valores corretos', async () => { // Este teste verifica se o caso de uso é chamado com a descrição correta
        const { createTodoUseCaseSpy } = makeTestTodoMakeMocks() //pego o espião que fica verifcando quando minha função de caso de uso é chamada
        const expectedParamCall = "Usecase should be called with this" //crio uma descrição para ser usada
        await createTodoAction(expectedParamCall) //chamo minha server action de criação de tarefa no servidor, e passo uma descrição valida pra ela a const "expectedParamCall"

        expect(createTodoUseCaseSpy).toHaveBeenCalledExactlyOnceWith(expectedParamCall) // Espero que o espião tenha sido chamado EXATAMENTE 1 VEZ com o argumento correto
    })

    test('deve chamar o revalidatePatch se o usecase retornar sucesso', async () => { // Este teste verifica se o revalidatePath é chamado quando o caso de uso tem sucesso
        const {revalidatePathMocked } = makeTestTodoMakeMocks() // Pego a mock da função que invalida o cache
        const description = "Usecase should be called with this" //passo uma descrição correta
        await createTodoAction(description) //chamo minha server action de criação de tarefa no servidor, e passo uma descrição valida pra ela a const "description"

        expect(revalidatePathMocked).toHaveBeenCalledExactlyOnceWith('/') //espero que o mock da função que invalida o cache da pagina seja chamado exatamente uma vez com o "\"

    })

    test('deve retornar o mesmo valor do usecase de sucesso', async () => { // Este teste verifica se o retorno da Server Action é o mesmo do caso de uso (sucesso)
         const {successResult } = makeTestTodoMakeMocks() //pego a constante que criei que tem sucesso la da minha mock
        const description = "Usecase should be called with this" //passo uma descrição correta
        const result = await createTodoAction(description) //chamo a server action para salvar a tarefa com a descrição correta e guardo em result 

        expect(result).toStrictEqual(successResult) //espero que o resultado da tentativa de salvamento seja estritamente igual a const de sucesso que criei de teste
     })

    test('deve retornar o mesmo valor do usecase em caso de erro', async () => { // Este teste verifica se o retorno da Server Action é o mesmo do caso de uso (erro)
        const {createTodoUseCaseSpy, errorResult  } = makeTestTodoMakeMocks() //pego o espiao do caso de uso, e a const que tem um teste invalido que traz um resultado falho
        const description = "Usecase should be called with this" // pego uma descrição que está correta

        createTodoUseCaseSpy.mockResolvedValue(errorResult) // Altero o retorno do espião: quando a função for chamada, retorne errorResult em vez do valor real
        const result = await createTodoAction(description) //chamo a server action para salvar a tarefa com a descrição correta e guardo em result 

        expect(result).toStrictEqual(errorResult) //espero que o resultado da tentativa de salvamento seja estritamente igual a const de erro que criei de teste
     })
})



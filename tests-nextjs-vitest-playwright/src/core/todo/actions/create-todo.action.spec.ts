import * as createTodoUseCaseMod from "../usecases/create-todo.usecase" //importo o modulo de caso de uso que persiste a criação da tarefa no banco
import { revalidatePath } from "next/cache" //Importa a função que invalida o cache de uma página do Next.js
import { InvalidTodo, ValidTodo } from "../schemas/todo.contract" //importo o type de tarefa valida e invalida
import { createTodoAction } from "./create-todo.action" //importo a server action de criação de tarefa no servidor

vi.mock('next/cache', () => { // Substituo o módulo real 'next/cache' por uma versão FALSA (mock) que eu controlo
    return { // Retorno o que quero que o módulo falso tenha
        revalidatePath: vi.fn() // Crio uma função vazia (mock) que NÃO executa a lógica real, apenas registra chamadas
    }
})

describe('createTodoAction (unit)', () => { //descrição desse bloco de testes, coloquei também que vai ser um teste unitario
    test('deve chamar o createTodoUseCase com os valores corretos', async () => { // Este teste verifica se o caso de uso é chamado com a descrição correta
        const { createTodoUseCaseSpy } = makeMocks() //pego o espião que fica verifcando quando minha função de caso de uso é chamada
        const expectedParamCall = "Usecase should be called with this" //crio uma descrição para ser usada
        await createTodoAction(expectedParamCall) //chamo minha server action de criação de tarefa no servidor, e passo uma descrição valida pra ela a const "expectedParamCall"

        expect(createTodoUseCaseSpy).toHaveBeenCalledExactlyOnceWith(expectedParamCall) // Espero que o espião tenha sido chamado EXATAMENTE 1 VEZ com o argumento correto
    })

    test('deve chamar o revalidatePatch se o usecase retornar sucesso', async () => { // Este teste verifica se o revalidatePath é chamado quando o caso de uso tem sucesso
        const {revalidatePathMocked } = makeMocks() // Pego a mock da função que invalida o cache
        const description = "Usecase should be called with this" //passo uma descrição correta
        await createTodoAction(description) //chamo minha server action de criação de tarefa no servidor, e passo uma descrição valida pra ela a const "description"

        expect(revalidatePathMocked).toHaveBeenCalledExactlyOnceWith('/') //espero que o mock da função que invalida o cache da pagina seja chamado exatamente uma vez com o "\"

    })

    test('deve retornar o mesmo valor do usecase de sucesso', async () => { // Este teste verifica se o retorno da Server Action é o mesmo do caso de uso (sucesso)
         const {successResult } = makeMocks() //pego a constante que criei que tem sucesso la da minha mock
        const description = "Usecase should be called with this" //passo uma descrição correta
        const result = await createTodoAction(description) //chamo a server action para salvar a tarefa com a descrição correta e guardo em result 

        expect(result).toStrictEqual(successResult) //espero que o resultado da tentativa de salvamento seja estritamente igual a const de sucesso que criei de teste
     })

    test('deve retornar o mesmo valor do usecase em caso de erro', async () => { // Este teste verifica se o retorno da Server Action é o mesmo do caso de uso (erro)
        const {createTodoUseCaseSpy, errorResult  } = makeMocks() //pego o espiao do caso de uso, e a const que tem um teste invalido que traz um resultado falho
        const description = "Usecase should be called with this" // pego uma descrição que está correta

        createTodoUseCaseSpy.mockResolvedValue(errorResult) // Altero o retorno do espião: quando a função for chamada, retorne errorResult em vez do valor real
        const result = await createTodoAction(description) //chamo a server action para salvar a tarefa com a descrição correta e guardo em result 

        expect(result).toStrictEqual(errorResult) //espero que o resultado da tentativa de salvamento seja estritamente igual a const de erro que criei de teste
     })
})


const makeMocks = () => { // Centralizo a criação de mocks e dados de teste para evitar repetição
    const successResult = { //como vou precisar ter uma tarefa bem sucedida, criei essa simulação
        success: true, //success como true
        todo: { //o objeto tarefa
            id: 'id', //que tem um id
            description: 'description', //uma descrição 
            createdAt: 'createdAt' //e a data de criação
        }
    } as ValidTodo; //informo também que essa tarefa é do type ValidTodo

    const errorResult = { // //como vou precisar ter uma tarefa mal sucedida, criei essa simulação
        success: false, //que tem o success como false já que a operação falhou
        errors: ['any', 'error'] //que tem esses erros
    } as InvalidTodo //informo também que essa tarefa é do type Invalid

    const createTodoUseCaseSpy = vi // Crio um espião
        .spyOn(createTodoUseCaseMod, "createTodoUseCase") //quero espionar esse modulo que mokei e dentro dele tenho essa função createTodoUseCase
        .mockResolvedValue(successResult) //assim que o espiao pegar quando a função é chamada, quero alterar o valor que a função retorna, o valor que vou querer retornar é na verdade é esse de uma tarefa bem sucedida "successResult"
    const revalidatePathMocked = vi.mocked(revalidatePath)  // Acesso a mock do revalidatePath que criei no vi.mock

    return { successResult, errorResult, createTodoUseCaseSpy, revalidatePathMocked }  // Retorno tudo que os testes precisam
}
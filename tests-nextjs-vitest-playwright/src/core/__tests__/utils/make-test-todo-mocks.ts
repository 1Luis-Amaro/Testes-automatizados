import { InvalidTodo, ValidTodo } from "@/core/todo/schemas/todo.contract";
import * as deleteTodoUseCaseMod from "@/core/todo/usecases/delete-todo.usecase";//importo o modulo de caso de uso que persiste a criação da tarefa no banco
import * as createTodoUseCaseMod from "@/core/todo/usecases/create-todo.usecase" //importo o modulo de caso de uso que persiste a criação da tarefa no banco
import { revalidatePath } from "next/cache" //Importa a função que invalida o cache de uma página do Next.js

export const makeTestTodoMakeMocks = () => { // Centralizo a criação de mocks e dados de teste para evitar repetição
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
    
        const deleteTodoUseCaseSpy = vi // Crio um espião
        .spyOn(deleteTodoUseCaseMod, "deleteTodoUseCase") //quero espionar esse modulo que mokei e dentro dele tenho essa função createTodoUseCase
        .mockResolvedValue(successResult) //assim que o espiao pegar quando a função é chamada, quero alterar o valor que a função retorna, o valor que vou querer retornar é na verdade é esse de uma tarefa bem sucedida "successResult"
    const revalidatePathMocked = vi.mocked(revalidatePath)  // Acesso a mock do revalidatePath que criei no vi.mock

    return { successResult, errorResult, createTodoUseCaseSpy, revalidatePathMocked, deleteTodoUseCaseSpy}  // Retorno tudo que os testes precisam
}
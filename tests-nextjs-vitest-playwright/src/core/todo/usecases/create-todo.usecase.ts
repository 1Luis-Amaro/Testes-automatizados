import { makeValidetedTodo } from "../factories/make-validated-todo";
import { todoRepository } from "../repositores/default.repository";


export async function createTodoUseCase (description: string) { //crio uma função de caso de uso e passo uma descrição como parametro pra ela
    const validateResult = makeValidetedTodo(description) //Chama a função de validação passando a descrição. Ela limpa a descrição, valida e, se for válida, cria o TODO
    if(!validateResult.success) { // Se a validação falhou (descrição inválida)
        return validateResult // Retorno o resultado da validação (com success: false e os errors) 
    }

    const createResult = await todoRepository.create(validateResult.todo) // Se a validação passou, persisto o TODO no banco de dados usando o repositório

    return createResult //retorno a tarefa criada
}
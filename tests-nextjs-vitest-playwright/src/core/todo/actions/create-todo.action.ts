"use server" // Diretiva que diz ao Next.js que todas as funções exportadas deste arquivo são Server Actions (só rodam no servidor)
import { revalidatePath } from "next/cache" // Importa a função que invalida o cache de uma página do Next.js
import { createTodoUseCase } from "../usecases/create-todo.usecase" // Importa o caso de uso que cria um TODO (valida e persiste no banco)

 

 export async function createTodoAction (description: string) { // Server Action que cria uma tarefa no servidor. Recebe a descrição como parâmetro
     const createResult = await createTodoUseCase(description) //pego minha função de caso de uso de criação de tarefa, e passo como parametro pra ela a descrição da tarefa Ele valida e persiste o TODO no banc
     if(createResult.success) { // Se a criação foi bem-sucedida (success = true)
        revalidatePath('/') // Invalido o cache da página inicial (home) para que o Next.js busque os dados atualizados (incluindo a nova tarefa)
     }

     return createResult // Retorno o resultado da operação (ValidTodo se deu certo, InvalidTodo se deu erro)
 }
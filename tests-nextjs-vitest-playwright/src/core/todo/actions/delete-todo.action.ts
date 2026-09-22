"use server" // Diretiva que diz ao Next.js que todas as funções exportadas deste arquivo são Server Actions (só rodam no servidor)
import { revalidatePath } from "next/cache" // Importa a função que invalida o cache de uma página do Next.js
import { deleteTodoUseCase } from "../usecases/delete-todo.usecase"

 

 export async function deleteTodoAction (id: string) { // Server Action que cria uma tarefa no servidor. Recebe a descrição como parâmetro
     const result = await deleteTodoUseCase(id) //pego minha função de caso de uso de criação de tarefa, e passo como parametro pra ela a descrição da tarefa Ele valida e persiste o TODO no banc
     if(result.success) { // Se a criação foi bem-sucedida (success = true)
        revalidatePath('/') // Invalido o cache da página inicial (home) para que o Next.js busque os dados atualizados (incluindo a nova tarefa)
     }

     return result // Retorno o resultado da operação (ValidTodo se deu certo, InvalidTodo se deu erro)
 }
import { sanitizeStr } from "@/utils/sanitize-str"; // Importa a função que limpa strings (remove caracteres especiais/espaços)
import { todoRepository } from "../repositores/default.repository"; // Importa o repositório de TODOs (conexão com o banco)
 
 
 export async function deleteTodoUseCase(id: string) { // Função de caso de uso que deleta um TODO. Recebe o ID como parâmetro
   const cleanId = sanitizeStr(id) // Chamo a função de limpeza de string para garantir que o ID não tem caracteres maliciosos
 
   if(!cleanId) {// Se a limpeza resultou em uma string vazia (ID inválido)
     return { //retorno esse objeto de erro
       success: false, // success: false (operação falhou)
       errors: ['ID inválido'] //e um erro no array de errors
     }
   }
 
   const deleteResult = await todoRepository.remove(id) // Se o ID é válido, chamo o método de remoção do repositório (que acessa o banco)
   return deleteResult // Retorno o resultado da operação (ValidTodo se deu certo, InvalidTodo se o TODO não existe)
 }
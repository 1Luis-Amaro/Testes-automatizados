import { Todo } from "../schemas/todo.contract"; // Importa o tipo Todo (contrato da tarefa)

export function makeNewTodo (description : string):Todo { // Função que cria uma nova tarefa, deve retornar um objeto que siga o tipo Todo
    return { // Retorno os campos obrigatórios do objeto
        id: crypto.randomUUID(), // Gera um ID único e aleatório (formato UUID v4)
        description, // A descrição passada pela pessoa (parâmetro da função)
        createdAt: new Date().toISOString(), // Data de criação no formato ISO (ex: '2026-09-09T10:00:00.000Z')
    }
}
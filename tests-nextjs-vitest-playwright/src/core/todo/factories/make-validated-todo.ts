import { sanitizeStr } from "@/utils/sanitize-str";
import { Todo } from "../schemas/todo.contract";
import { validateTodoDescription } from "../schemas/validate-todo-description";
import { makeNewTodo } from "./make-new-todo";

type InvalidTodo = { //crio esse tipo para criar regras e manter a estrutura do meu código integro (caso de erro)
    success: false;
    errors: string[]
}

type ValidTodo = { //crio esse tipo para criar regras e manter a estrutura do meu código integro (caso de sucesso)
    success: true;
    data: Todo
}

type MakeValidatedTodo = ValidTodo | InvalidTodo // União dos dois tipos (pode ser sucesso ou erro)

export function makeValidetedTodo (description: string)//função de validar uma nova tarefa
 :MakeValidatedTodo { // Coloco o tipo que criei: se tudo der certo, retorna ValidTodo; se der erro, retorna InvalidTodo
    const cleanDescription = sanitizeStr(description); // Pego a função de limpeza de caracteres especiais e aplico na descrição
    const validatedDesciption = validateTodoDescription(cleanDescription)  // Pego a função de validação de descrição (verifica se tem 3 ou mais caracteres)

    if (validatedDesciption.success) { // se a validação de descrição deu certo
        return { //vou retornar o estado de sucesso
            success: true, //coloco success como true para falar que deu certo
            data: makeNewTodo(cleanDescription) // Crio a nova tarefa com a descrição limpa e retorno os dados
        }
    }

    return { //agora se der falso vou retornar esse estado de erro
        success: false, //success deixo como falso
        errors:validatedDesciption.errors // e trago os erros da minha função de validação de descrição
    }
}
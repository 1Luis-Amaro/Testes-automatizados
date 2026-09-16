import { DrizzleDatabase } from "@/db/drizzle"; // Importa o tipo da conexão com o banco de dados (Drizzle)
import { TodoRepository } from "./todo.contract.repository"; // Importa a interface TodoRepository (contrato com os métodos findAll, create e remove)
import { Todo, TodoPresenter } from "../schemas/todo.contract"; // Importa o modelo da tarefa (Todo) e o tipo de retorno (TodoPresenter = ValidTodo | InvalidTodo)
import { todoTable } from "../schemas/drizzle-todo-table.schema"; // Importa a definição da tabela 'todo' do banco
import { eq } from "drizzle-orm"; // Importa o operador de igualdade do Drizzle

export class DrizzleTodoRepository implements TodoRepository {  // Crio uma classe que implementa a interface TodoRepository (precisa ter todos os métodos: findAll, create e remove)
    private readonly db: DrizzleDatabase; // Instancio o banco de dados, deixo privado e somente leitura (não pode ser alterado)

    constructor(db: DrizzleDatabase) { // Construtor que recebe a conexão com o banco 
        this.db = db // Uso o this para guardar a conexão na instância da classe
    }

    async findAll(): Promise<Todo[]> { // Método que busca todas as tarefas. Prometo retornar um array do tipo Todo
        return await this.db.query.todo.findMany({  // Acesso o banco e uso a função findMany do Drizzle (busca vários)
            orderBy: (todo, { desc }) => [ // Ordeno os resultados de forma decrescente
                desc(todo.createdAt),// Ordeno pela data de criação (mais recente primeiro)
                desc(todo.description),// E também pela descrição (ordem alfabética inversa)
            ]
        })

    }
    async create(todoData: Todo): Promise<TodoPresenter> { // Método que cria uma tarefa. Recebe um Todo como parâmetro e prometo retornar um TodoPresenter (ValidTodo ou InvalidTodo)
        const existingTodo = await this.db.query.todo.findFirst({ // Busco o primeiro todo que atenda à condição 
            where: (todoTable, { eq, or }) => or( //onde na tabela a Condição: ID igual OU descrição igual
                eq(todoTable.id, todoData.id), //que o id da tabela seja igual do que estou tentando criar 
                eq(todoTable.description, todoData.description) // e que a descrição do todo que estou tentando criar seja igual da tabela
            )
        })

        if (!!existingTodo) { // Se já existe um todo com o mesmo ID ou descrição (!! converte para boolean)
            return { //vou retornar um estado de erro
                success: false, //deixo o success como false ja que a operação falhou
                errors: ['Já existe um todo com ID ou descrição enviados'] //e mando esse erro para o usuário
            }
        }

        await this.db.insert(todoTable).values(todoData) //agora se essa validação deu errado, não tem id nem descrição ja existente, insiro no meu banco de dados os valores enviados pelo usuário 

        return { success: true, todo: todoData } // e retorno uma tarefa valida finalizando assim minha promisse 
    }
    async remove(id: string): Promise<TodoPresenter> { //aqui faço a logica do remoção, passo como parametro o id , e prometo que vou retornar uma tarefa valida ou invalida
        const existingTodoremove = await this.db.query.todo.findFirst({ // Busco o primeiro todo com o ID informado
            where: (todoTable, {eq} ) => (eq(todoTable.id, id) // Condição: ID da tabela = ID passado como parâmetro
            )
})
    if(!existingTodoremove) { // Se NÃO encontrou o todo (tarefa não existe
        return { //então vou retornar um estado de erro
            success: false, //deixo o success como false já que a operação falhou
            errors: ['Todo não existe'] //e mando esse erro pro usuário
        }

    }
    await this.db.delete(todoTable).where(eq(todoTable.id, id)) //agora se deu certo pegar a tarefa vou fazer a removação dela no banco
    return { success: true, todo: existingTodoremove } // e retorno uma tarefa valida finalizando assim minha promisse 
    }
    
  
}
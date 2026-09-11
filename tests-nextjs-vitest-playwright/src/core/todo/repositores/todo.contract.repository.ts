import { Todo, TodoPresenter } from "../schemas/todo.contract"; // Importo o modelo da tarefa (Todo) e o tipo de retorno (TodoPresenter = ValidTodo | InvalidTodo)

export interface FindAllTodoRepository { //interface que criei para procurar todas minhas tarefas criadas
    findAll(): Promise<Todo[]> //para procurar vou usar essa nomeclatura (ainda preciso criar a lógica do finAll), prometo que o findAll vai me retornar um array do tipo Todo
 
}

export interface CreateTodoRepository {//interface que criei para criar novas tarefas
    create(todo: Todo): Promise<TodoPresenter>//para crair vou usar essa nomeclatura (ainda preciso criar a lógica do create), Recebe um Todo como parâmetro e prometo que vai retornar um TodoPresenter (ValidTodo ou InvalidTodo)
}

export interface DeleteTodoRepository {//interface que criei para deletar tarefas 
    remove(id: string): Promise<TodoPresenter> //para deletar vou usar essa nomeclatura (ainda preciso criar a lógica do remove), passo como parametro o id da tarefa e prometo que o remove vai me retornar uma tarefa valida ou invalida 
}
// Interface composta que agrupa todas as outras interfaces (FindAll, Create, Delete)
// Assim, quem implementar TodoRepository precisa implementar todos os métodos de uma vez
export interface TodoRepository 
    extends FindAllTodoRepository,
    CreateTodoRepository,
    DeleteTodoRepository{}

import { DrizzleTodoRepository } from "@/core/todo/repositores/drizzle-todo.repository"; // Importa a classe que implementa o repositório de todos
import { drizzleDatabase } from "@/db/drizzle"; // Importa a conexão com o banco (Drizzle) e a tabela 'todo'
import { eq } from "drizzle-orm"; // Importa o operador de igualdade do Drizzle

export async function makeTestTodoRepository() { /// Função que centraliza os métodos do banco para usar nos testes 
    const { db, todoTable } = drizzleDatabase //db é A conexão com o banco (instância do Drizzle), todo é minha tabela de tarefas 
    const repository = new DrizzleTodoRepository(db) // Instancia o repositório passando a conexão com o banco
    const todos = makeTestTodos()    
    const insertTodoDb = () => db.insert(todoTable) // pego o metodo de insersação do banco e coloco na minha const insertTodoDb 
    const deleteTodoNoWhere = () => db.delete(todoTable) // pego o metodo de deleção do banco e coloco na minha const deleteTodoNoWhere, aqui eu excluo todos os dados do banco 
    const deleteTodoDb = (id: string) => db.delete(todoTable).where(eq(todoTable.id, id))// pego o metodo de deleção só que aqui eu deleto por ID informado
    return { //após pegar todo os metodos, retorno todos eles para serem usados nos testes
        todos,
        repository, // O repositório completo (com findAll, create, remove)
        insertTodoDb, // Função para inserir todos
        deleteTodoNoWhere, // Função para deletar TODOS os todos (limpar a tabela)
        deleteTodoDb, // Função para deletar um todo específico por ID
    }

}

export const insertTestTodos = async () => {  // Função que insere 5 tarefas de teste no banco
    const { insertTodoDb } = await makeTestTodoRepository() //Pega o método de inserção do repositório de testes
    const todos = makeTestTodos() // pego as 5 tarefas de teste que criei manualmente (array com 5 objetos) 

    await insertTodoDb().values(todos); // Insere as 5 tarefas no banco de dados

    return todos; // Retorna as tarefas que foram criadas
}

export const makeTestTodos = () => { //criei uma variavel que cria cinco tarefas manuais, exporto ela pra poder usar essas tarefa em outros lugares
    return Array.from({ length: 5 }).map((_, index) => {// Cria um array de 5 posições (índices 0, 1, 2, 3, 4) o _ antes do index indica que eu mão me importo com esse parametro, como no map preciso de dois tenho que colocar algo ali então uso ele
        const newTodo = { // durante o looping do map quero criar um novo objeto com um
            id: index.toString(), // ID = índice convertido para string (ex: '0', '1', '2', '3', '4')
            description: `Todo ${index}`, // Descrição = 'Todo 0', 'Todo 1', etc
            createdAt: `date ${index}`, // Data de criação = 'date 0', 'date 1', etc
        }
        return newTodo // Retorna o objeto criado 
    })
}
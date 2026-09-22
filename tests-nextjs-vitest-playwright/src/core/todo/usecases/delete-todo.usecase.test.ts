import { makeTestTodoRepository } from "@/core/__tests__/utils/make-test-todo-repository";
import { deleteTodoUseCase } from "./delete-todo.usecase";
describe('deleteTodoUseCase (integration)', () => { // Descrição do bloco de teste (teste de integração do caso de uso de deleção)
  beforeEach(async () => { // Antes de CADA teste, quero fazer o seguinte:
    const { deleteTodoNoWhere } = await makeTestTodoRepository(); // Pego a função de delete sem where (excluir todos os dados do banco)
    await deleteTodoNoWhere(); // Chamo a função com await (operação assíncrona). Limpa o banco antes de cada teste, garantindo isolamento
  });

  afterAll(async () => { // Depois de TODOS os testes, quero fazer o seguinte:
    const { deleteTodoNoWhere } = await makeTestTodoRepository(); // Pego a função de delete sem where
    await deleteTodoNoWhere(); // Chamo a função com await. Limpa o banco depois de todos os testes, garantindo que não fique lixo
  });

  test('deve retornar erro se o id for invalid', async () => { //se o id estiver errado esse teste me retorna um erro 
    const result = await deleteTodoUseCase('') //pego o caso de uso de deleção, passo um parametro vazio para dar erro e guardo em result,

    expect(result).toStrictEqual({ //espero que o resultado do meu caso de uso de deleção seja
      errors: ['ID inválido'], //errors com o array e esse erro nele
      success: false, //e success como false já que a operação falhou
    })

  })

  test('deve retornar sucesso se o todo existe na base de dados', async () => { //teste que deve me retornar sucesso se eu tentar excluir ele e ele existir
    const { insertTodoDb, todos } = await makeTestTodoRepository()
    await insertTodoDb().values(todos) //insiro uma tarefa no banco 

    const result = await deleteTodoUseCase(todos[0].id) //pego o caso de uso de deleção e tento excluir a tarefa pelo id e que esteja no indice 0 

    expect(result).toStrictEqual({ //como a tarefa existe então a deleção vai dar certo espero que o resultado seja 
      success: true, //success como true já que a operação deu certo
      todo: todos[0] //e a tarefa do indice 0 
    })



  })
  test('deve retornar erro se o todo não existe na base de dados', async () => { //nesse teste retorno erro se ao tentar excluir a tarefa ela não existir na base de dados
    const result = await deleteTodoUseCase('this-does-not-exist') //não criei nenhuma tarefa então não existe nenhuma, guardo a tentativa falha de deleção e result

    expect(result).toStrictEqual({ //espero que result seja estritamente igual 
      errors: ['Todo não existe'], //a esse array de errors 
      success: false //e que tenha success como false
    })



  })


})

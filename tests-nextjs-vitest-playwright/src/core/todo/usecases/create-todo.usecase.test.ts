import { makeTestTodoRepository } from "@/core/__tests__/utils/make-test-todo-repository"; // Importa a função que cria o repositório de testes
import { createTodoUseCase } from "./create-todo.usecase"; // Importa o caso de uso que cria um TODO
import { InvalidTodo, ValidTodo } from "../schemas/todo.contract"; // Importa os tipos de retorno (InvalidTodo e ValidTodo)

describe('createTodoUseCase (integration)', () => { // Descrição do bloco de teste (teste de integração do caso de uso)
  beforeEach(async () => { // Antes de CADA teste, quero fazer o seguinte:
    const { deleteTodoNoWhere } = await makeTestTodoRepository(); // Pego a função de delete sem where (excluir todos os dados do banco)
    await deleteTodoNoWhere(); // Chamo a função com await (operação assíncrona). Limpa o banco antes de cada teste, garantindo isolamento
  });

  afterAll(async () => { // Depois de TODOS os testes, quero fazer o seguinte:
    const { deleteTodoNoWhere } = await makeTestTodoRepository(); // Pego a função de delete sem where
    await deleteTodoNoWhere(); // Chamo a função com await. Limpa o banco depois de todos os testes, garantindo que não fique lixo
  });

  test('deve retornar erro se a validação falhar', async () => { // Se a validação falhar, o teste deve retornar erro
    const result = await createTodoUseCase("") as InvalidTodo; // Chamo o caso de uso com uma descrição vazia (inválida) e forço o tipo como InvalidTodo

    expect(result.success).toBe(false); // Espero que o success seja false (operação falhou)
    expect(result.errors).toHaveLength(1); // E que o array de erros tenha 1 mensagem (descrição vazia gera 1 erro)
  });

  test('Deve retornar um TODO se a validação passar', async () => { // Este teste retorna um TODO se a validação passar
    const description = 'isso deve funcionar'; // Crio uma descrição válida
    const result = await createTodoUseCase(description) as ValidTodo; // Chamo o caso de uso com a descrição válida e forço o tipo como ValidTodo

    expect(result.success).toBe(true); // Espero que o success seja true (operação bem-sucedida)
    expect(result.todo).toStrictEqual({ // Espero que o TODO retornado seja estritamente igual a:
      "createdAt": expect.any(String), // Qualquer data de criação que seja uma string
      description, // A descrição que eu passei (válida)
      "id": expect.any(String), // E qualquer ID que seja uma string
    });
  });

  test('Deve retornar erro se o repositório falhar', async () => { // Este teste retorna erro se o repositório falhar (TODO duplicado)
    // Cria o TODO uma vez
    const description = 'isso deve funcionar'; // Passo uma descrição válida
    await createTodoUseCase(description) as ValidTodo; // Chamo o caso de uso com a descrição válida (cria o TODO)

    // Tenta recriar o TODO e DEVE retornar erro
    const result = await createTodoUseCase(description) as InvalidTodo; // Tento criar a tarefa novamente com a mesma descrição e forço o tipo como InvalidTodo

    expect(result.success).toBe(false); // Espero que o success seja false (já existe um TODO com essa descrição)
    expect(result.errors).toStrictEqual([ // Espero que o array de erros seja estritamente igual a:
      "Já existe um todo com ID ou descrição enviados" // Mensagem de erro do repositório
    ]);
  });
});
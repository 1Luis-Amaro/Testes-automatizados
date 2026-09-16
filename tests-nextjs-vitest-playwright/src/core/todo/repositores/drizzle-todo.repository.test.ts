import { insertTestTodos, makeTestTodoRepository } from "@/core/__tests__/utils/make-test-todo-repository" //importo a função que cria 5 tarefas de teste no banco, e importo o repositorio com meus metodos do banco   
import { Todo } from "../schemas/todo.contract";


describe('DrizzleTodoRepository (integration)', () => { //descrição do meu bloco de teste e falo que é um teste de integração
    beforeEach(async () => { //antes de CADA teste quero fazer o seguinte 
        const { deleteTodoNoWhere } = await makeTestTodoRepository(); //pego minha função de delete sem where para excluir todos os dados do banco 
        await deleteTodoNoWhere(); // Chamo a função com await (é uma operação assíncrona que pode demorar). Isso limpa o banco antes de cada teste, garantindo isolamento entre os testes 
    });
    describe('findAll', () => { // Descrição deste trecho: teste do método findAll (buscar todas as tarefas)
        test('deve retornar um array vazio se a tabela estiver limpa', async () => { // Descrição do teste: retorna um array vazio se não houver tarefas
            const { repository } = await makeTestTodoRepository(); //pego o repositorio que tem pega os metodos do banco 
            const result = await repository.findAll(); // Chamo o método findAll e guardo o resultado na const result 
            expect(result).toStrictEqual([]); //espero que o resultado seja estritamente igual a um array vazio
            expect(result).toHaveLength(0); //espero que o tamanho de resultado tem que ser 0, isso indica que esta vazio, tabela vazia 
        });
        test('deve retornar todos os TODOs em ordem decrescente', async () => { //descrição do teste, esse teste vai retornar minhas tarefas em ordem decrescente 
            const { repository } = await makeTestTodoRepository(); // pego o repositorio com os meus metodos do banco 
            await insertTestTodos(); //insiro minhas 5 tarefas no banco 
            const result = await repository.findAll(); // Chamo o método findAll e guardo o resultado na const result 
            expect(result[0].createdAt).toBe('date 4'); // Espero que o primeiro item (índice 0) tenha createdAt = 'date 4'
            expect(result[1].createdAt).toBe('date 3'); // Espero que o segundo item (índice 1) tenha createdAt = 'date 3'
            expect(result[2].createdAt).toBe('date 2'); // Espero que o terceiro item (índice 2) tenha createdAt = 'date 2'
            expect(result[3].createdAt).toBe('date 1'); // Espero que o quarto item (índice 3) tenha createdAt = 'date 1'
            expect(result[4].createdAt).toBe('date 0'); // Espero que o quinto item (índice 4) tenha createdAt = 'date 0'
        })
    })

   describe('create', () => { // Descrição deste trecho: teste do método create (criar tarefas)
    test('cria um TODO se os dados estão validos', async () => { // Descrição do teste: cria uma tarefa se for válida
      const { repository, todos } = await makeTestTodoRepository(); // Pego o repositório e as tarefas de teste
      const newTodo = await repository.create(todos[0]); // Crio uma nova tarefa no índice 0
      expect(newTodo).toStrictEqual({ // Espero que o retorno seja estritamente igual ao objeto esperado:
        success: true, // success: true (operação bem-sucedida)
        todo: todos[0] // E o todo no índice 0
      });
    });

    test('falha se houver uma descrição igual na tabela', async () => { // Descrição do teste: falha se a descrição já existir
      const { repository, todos } = await makeTestTodoRepository(); // Pego o repositório e as tarefas de teste
      await repository.create(todos[0]); // Crio um TODO no índice 0

      const anotherTodo = { // Crio um novo objeto com a mesma descrição
        id: 'any id', // ID diferente (quero testar a descrição)
        description: todos[0].description, // Mesma descrição do todo do índice 0
        createdAt: 'any date', // Data diferente (quero testar a descrição)
      };
      const result = await repository.create(anotherTodo); // Tento criar outro todo com a mesma descrição
      expect(result).toStrictEqual({ // Espero que o retorno seja estritamente igual ao objeto de erro:
        success: false, // success: false (operação falhou)
        errors: ['Já existe um todo com ID ou descrição enviados'] // E a mensagem de erro
      });
    });

    test('falha se houver uma ID igual na tabela', async () => { // Descrição do teste: falha se o ID já existir
      const { repository, todos } = await makeTestTodoRepository(); // Pego o repositório e as tarefas de teste
      await repository.create(todos[0]); // Crio um TODO no índice 0

      const anotherTodo = { // Crio um novo objeto com o mesmo ID
        id: todos[0].id, // Mesmo ID do todo do índice 0
        description: 'any description', // Descrição diferente (quero testar o ID)
        createdAt: 'any date' // Data diferente (quero testar o ID)
      };
      const result = await repository.create(anotherTodo); // Tento criar outro todo com o mesmo ID
      expect(result).toStrictEqual({ // Espero que o retorno seja estritamente igual ao objeto de erro:
        success: false, // success: false (operação falhou)
        errors: ['Já existe um todo com ID ou descrição enviados'] // E a mensagem de erro
      });
    });

    test('falha se houver uma ID e Descrição iguais', async () => { // Descrição do teste: falha se ID e descrição já existirem
      const { repository, todos } = await makeTestTodoRepository(); // Pego o repositório e as tarefas de teste
      await repository.create(todos[0]); // Crio um TODO no índice 0

      const anotherTodo = { // Crio um novo objeto com o mesmo ID e descrição
        id: todos[0].id, // Mesmo ID do todo do índice 0
        description: todos[0].description, // Mesma descrição do todo do índice 0
        createdAt: 'any date' // Data diferente (quero testar ID e descrição)
      };
      const result = await repository.create(anotherTodo); // Tento criar outro todo com mesmo ID e descrição
      expect(result).toStrictEqual({ // Espero que o retorno seja estritamente igual ao objeto de erro:
        success: false, // success: false (operação falhou)
        errors: ['Já existe um todo com ID ou descrição enviados'] // E a mensagem de erro
      });
    });
  });

  describe('delete', () => { // Descrição deste trecho: teste do método delete (deletar tarefas)
    test('apaga um todo se ele existir', async () => { // Descrição do teste: apaga uma tarefa se ela existir
      const { repository, todos } = await makeTestTodoRepository(); // Pego o repositório e as tarefas de teste
      await insertTestTodos(); // Insiro as 5 tarefas no banco
      const result = await repository.remove(todos[0].id); // Removo a tarefa do índice 0 pelo ID
      expect(result).toStrictEqual({ // Espero que o retorno seja estritamente igual ao objeto esperado:
        success: true, // success: true (operação bem-sucedida)
        todo: todos[0] // E a tarefa do índice 0
      });
    });

    test('falha ao apagar se o todo não existir', async () => { // Descrição do teste: falha ao apagar uma tarefa que não existe
      const { repository } = await makeTestTodoRepository(); // Pego o repositório
      await insertTestTodos(); // Insiro as 5 tarefas no banco
      const result = await repository.remove('any id'); // Tento remover com um ID que não existe
      expect(result).toStrictEqual({ // Espero que o retorno seja estritamente igual ao objeto de erro:
        success: false, // success: false (operação falhou)
        errors: ['Todo não existe'] // E a mensagem de erro
      });
    });
  });
});




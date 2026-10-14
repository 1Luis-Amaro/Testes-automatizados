import { CreateTodoAction, DeleteTodoAction } from '@/core/todo/actions/todo.action.type'; // Importa os tipos das actions de criar e deletar
import { fn } from '@storybook/test'; // Importa a função 'fn' do Storybook (cria funções mock/simuladas)

// A ideia daqui é criar actions mockadas (simuladas) para testar nas stories
export const todoActionStoryMock = {  // Objeto que agrupa as actions simuladas do todo
  create: { // Action de criar (create) 
    success: fn(async () => { // Função mock que simula uma criação bem-sucedida
      return { //retorno da minha simulçao 
        success: true, // success: true (operação bem-sucedida) 
        todo: { id: 'id', description: 'desc', createdAt: 'data' }, // Tarefa criada com sucesso
      };
    }) as CreateTodoAction, //associo essa função ao meu type CreateTodoAction

    error: fn(async () => { // Função mock que simula um erro ao criar
      return { //retorno da minha simulação
        success: false, //deixo o sucess como false ja que a operação falhou
        errors: ['falha ao criar todo'], //e no array de error coloco esse erro
      };
    }) as CreateTodoAction, //e associo essa função ao meu type CreateTodoAction
  },

  delete: { // Action de deletar (delete) 
    success: fn(async () => { // Função mock que simula uma exclusão bem-sucedida
      return { //retorno da simulação
        success: true, //deixo success como true ja que deu certo minha operação
        todo: { id: 'id', description: 'desc', createdAt: 'data' }, // Tarefa deletada com sucesso
      };
    }) as DeleteTodoAction, //e associo essa função ao meu type DeleteTodoAction

    error: fn(async () => { // Função mock que simula um erro ao deleta
      return { //retorno da simulação
        success: false, //deixo success como false já que a operação falhou
        errors: ['falha ao deletar todo'], //insiro esse valor no meu array de erros
      };
    }) as DeleteTodoAction, //associo essa função ao meu type DeleteTodoAction

    delayed: fn(async () => {// Função mock que simula uma exclusão com atraso (delay)
      await new Promise(r => setTimeout(r, 2000)); // Espera 2 segundos (delay)
      return { //retorno da simulação
        success: true, //success como true ja que a operação foi bem sucedida
        todo: { id: 'id', description: 'desc', createdAt: 'data' }, // Tarefa deletada com sucesso
      };
    }) as DeleteTodoAction, //essa função simulada é do type DeleteTodoAction
  },
};
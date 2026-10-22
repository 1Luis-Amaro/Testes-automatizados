import {
  insertTestTodos,
  makeTestTodoRepository,
} from '@/core/__tests__/utils/make-test-todo-repository'; // Importa as funções para inserir e limpar os todos no banco
import { TodoContainer } from '.'; // Importa o componente TodoContainer
import { render, screen, within } from '@testing-library/react'; // Importa as funções render, screen e within da Testing Library

describe('<TodoContainer/> (integration)', () => { // Descrição do bloco de teste (teste de integração)
  beforeEach(async () => { // Antes de CADA teste, quero fazer o seguinte:
    const { deleteTodoNoWhere } = await makeTestTodoRepository(); // Pego a função de delete sem where (excluir todos os dados do banco)
    await deleteTodoNoWhere(); // Chamo a função com await (operação assíncrona). Limpa o banco antes de cada teste, garantindo isolamento
    await insertTestTodos(); // Insere os todos de teste no banco (para que a lista seja renderizada)
  });

  afterAll(async () => { // Depois de TODOS os testes, quero fazer o seguinte:
    const { deleteTodoNoWhere } = await makeTestTodoRepository(); // Pego a função de delete sem where
    await deleteTodoNoWhere(); // Chamo a função com await. Limpa o banco depois de todos os testes
  });

  test('deve renderizar TodoList e TodoForm na tela', async () => { // O que meu teste verifica: se o TodoList e o TodoForm são renderizados
    render(await TodoContainer()); // Renderiza o componente TodoContainer (que é assíncrono)

    const headingAccessibleName = 'Lista de tarefas'; // Crio um nome acessível para o heading (para acessibilidade)
    const heading = screen.getByRole('heading', { // Busca o elemento de título (<h1>) pela role 'heading'
      name: headingAccessibleName, // E pelo nome acessível 'Lista de tarefas'
    });
    const list = screen.getByRole('list', { name: headingAccessibleName }); // Busca a lista (<ul>) pela role 'list' e pelo nome acessível
    const listItems = within(list).getAllByRole('listitem'); // Busca TODOS os itens da lista DENTRO da lista (usando within)
    const input = screen.getByLabelText('Tarefa'); // Busca o input associado ao label 'Tarefa'
    const btn = screen.getByRole('button', { name: 'Criar tarefa' }); // Busca o botão pelo nome acessível 'Criar tarefa'

    expect(heading).toHaveTextContent(headingAccessibleName); // Espero que o heading tenha o texto 'Lista de tarefas'
    expect(list).toHaveAttribute('aria-labelledby', heading.id); // Espero que a lista aponte para o ID do heading (acessibilidade)
    expect(listItems).toHaveLength(5); // Espero que a lista tenha 5 itens
    expect(input).toHaveAttribute('placeholder', 'Digite sua tarefa'); // Espero que o input tenha o placeholder 'Digite sua tarefa'
    expect(btn).toHaveAttribute('type', 'submit'); // Espero que o botão tenha o atributo type='submit'
  });
});
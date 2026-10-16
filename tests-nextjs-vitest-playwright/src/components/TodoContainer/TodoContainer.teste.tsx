import {
  insertTestTodos,
  makeTestTodoRepository,
} from '@/core/__tests__/utils/make-test-todo-repository';
import { TodoContainer } from '.';
import { render, screen, within } from '@testing-library/react';

describe('<TodoContainer/> (integration)', () => {
  beforeEach(async () => {
    //antes de CADA teste quero fazer o seguinte
    const { deleteTodoNoWhere } = await makeTestTodoRepository(); //pego minha função de delete sem where para excluir todos os dados do banco
    await deleteTodoNoWhere(); // Chamo a função com await (é uma operação assíncrona que pode demorar). Isso limpa o banco antes de cada teste, garantindo isolamento entre os testes
    await insertTestTodos(); //preciso inserir todos na lista
  });
  afterAll(async () => {
    const { deleteTodoNoWhere } = await makeTestTodoRepository(); //pego minha função de delete sem where para excluir todos os dados do banco
    await deleteTodoNoWhere();
  });

  test('deve renderizar TodoList e TodoForm na tela', async () => {
    render(await TodoContainer());

    const headingAccessibleName = 'Lista de tarefas';
    const heading = screen.getByRole('heading', {
      name: headingAccessibleName,
    });
    const list = screen.getAllByRole('list', { name: headingAccessibleName});
    const listItems = within(list).getAllByRole('listitem')
    const input = screen.getAllByLabelText('Tarefa')
    const btn = screen.getByRole('button')

    expect(heading).toHaveTextContent(headingAccessibleName)
    expect(list).toHaveAttribute('aria-labelledby', heading.id)
    expect(listItems).toHaveLength(5)
  });
});

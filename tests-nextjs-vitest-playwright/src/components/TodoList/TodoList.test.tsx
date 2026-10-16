import { render, screen, waitFor, within } from '@testing-library/react'; // Importa as funções render, screen, waitFor e within da Testing Library
import { TodoList } from '.'; // Importa o componente TodoList
import { Todo } from '@/core/todo/schemas/todo.contract'; // Importa o tipo Todo
import userEvent from '@testing-library/user-event'; // Importa o userEvent para simular interações do usuário
import { mockTodos } from '@/core/__tests__/mocks/todo'; // Importa as tarefas simuladas (mock)

const user = userEvent.setup(); // Configura o userEvent (simula interações do usuário)

describe('<TodoList /> (integration)', () => { // Descrição do bloco de testes (teste de integração do TodoList)
  test('deve renderizar heading, lista e itens da lista de TODOs', async () => { // O que o teste verifica: se o heading, a lista e os itens são renderizados
    const { todos } = renderList(); // Renderiza a lista com as tarefas padrão (mockTodos) e pega as tarefas

    const heading = screen.getByRole('heading', { // Busca o elemento <h1> (heading) pela role 'heading'
      name: /lista de tarefas/i, // E pelo texto 'Lista de tarefas' (usando regex para ignorar maiúsculas/minúsculas)
      level: 1, // E pelo nível 1 (h1)
    });
    const list = screen.getByRole('list', { name: /lista de tarefas/i }); // Busca a lista (<ul>) pela role 'list' e pelo nome acessível
    const items = screen.getAllByRole('listitem'); // Busca todos os itens da lista (<li>) pela role 'listitem'

    expect(heading).toBeInTheDocument(); // Espero que o heading exista no DOM
    expect(list).toHaveAttribute('aria-labelledby', heading.id); // Espero que a lista tenha o atributo aria-labelledby apontando para o ID do heading

    expect(items).toHaveLength(todos.length); // Espero que a quantidade de itens seja igual à quantidade de tarefas

    items.forEach((item, index) => { // Para cada item da lista
      expect(item).toHaveTextContent(todos[index].description); // Espero que o item contenha a descrição da tarefa correspondente
    });
  });

  test('não deve renderizar a lista de items sem TODOs', async () => { // O que o teste verifica: se a lista NÃO é renderizada quando não há tarefas
    renderList({ todos: [] }); // Renderiza a lista com um array de tarefas vazio

    const list = screen.queryByRole('list', { name: /lista de tarefas/i }); // Busca a lista (usando queryByRole porque ela PODE não existir)

    expect(list).not.toBeInTheDocument(); // Espero que a lista NÃO exista no DOM
  });

  test('deve chamar a action correta para cada item da lista', async () => { // O que o teste verifica: se a action é chamada com o ID correto de cada tarefa
    const { action, todos } = renderList(); // Renderiza a lista e pega a action e as tarefas

    const items = screen.getAllByRole('listitem'); // Busca todos os itens da lista
    const btn0 = within(items[0]).getByRole('button'); // Busca o botão do primeiro item (usando within para buscar DENTRO do item)
    const btn1 = within(items[1]).getByRole('button'); // Busca o botão do segundo item
    const btn2 = within(items[2]).getByRole('button'); // Busca o botão do terceiro item

    await user.click(btn0); // Simula um clique no primeiro botão
    await user.click(btn1); // Simula um clique no segundo botão
    await user.click(btn2); // Simula um clique no terceiro botão

    expect(action).toHaveBeenCalledTimes(3); // Espero que a action tenha sido chamada 3 vezes

    expect(action.mock.calls[0][0]).toBe(todos[0].id); // Espero que a primeira chamada tenha sido com o ID da primeira tarefa
    expect(action.mock.calls[1][0]).toBe(todos[1].id); // Espero que a segunda chamada tenha sido com o ID da segunda tarefa
    expect(action.mock.calls[2][0]).toBe(todos[2].id); // Espero que a terceira chamada tenha sido com o ID da terceira tarefa
  });

  test('deve desativar os items da lista enquanto envia a action', async () => { // O que o teste verifica: se os itens ficam com a classe de desabilitado enquanto a action roda
    renderList({ delay: 10 }); // Renderiza a lista com um delay de 10ms na action

    const list = screen.getByRole('list', { name: /lista de tarefas/i }); // Busca a lista
    const items = screen.getAllByRole('listitem'); // Busca todos os itens da lista
    const btns = within(list).getAllByRole('button'); // Busca todos os botões DENTRO da lista
    await user.click(btns[1]); // Simula um clique no segundo botão

    const expectedDisabledCls = 'bg-amber-200 text-amber-900 hover:scale-105 transition flex justify-between py-2 px-4 rounded-lg'; // Classes esperadas quando o item está desabilitado
    const expectedEnabledCls = 'bg-amber-200 text-amber-900 hover:scale-105'; // Classes esperadas quando o item está habilitado

    await waitFor(() => { // Espera até que...
      items.forEach(item => expect(item).toHaveClass(expectedDisabledCls)); // ...todos os itens tenham a classe de desabilitado
    });

    await waitFor(() => { // Espera até que...
      items.forEach(item => expect(item).toHaveClass(expectedEnabledCls)); // ...todos os itens voltem a ter a classe de habilitado
    });
  });

  test('deve desativar os botões da lista enquanto envia a action', async () => { // O que o teste verifica: se os botões ficam desabilitados enquanto a action roda
    renderList({ delay: 10 }); // Renderiza a lista com um delay de 10ms na action

    const list = screen.getByRole('list', { name: /lista de tarefas/i }); // Busca a lista
    const btns = within(list).getAllByRole('button'); // Busca todos os botões DENTRO da lista
    await user.click(btns[1]); // Simula um clique no segundo botão

    await waitFor(() => { // Espera até que...
      btns.forEach(btn => expect(btn).toBeDisabled()); // ...todos os botões estejam desabilitados
    });

    await waitFor(() => { // Espera até que...
      btns.forEach(btn => expect(btn).toBeEnabled()); // ...todos os botões voltem a estar habilitados
    });
  });

  test('deve avisar o usuário se houver erro ao apagar o TODO', async () => { // O que o teste verifica: se o alerta é exibido quando a action falha
    renderList({ success: false }); // Renderiza a lista com a action de erro

    const alertFn = vi.fn(); // Cria uma função mock para o alert
    vi.stubGlobal('alert', alertFn); // Substitui o alert global pela função mock
    const btns = screen.getAllByRole('button'); // Busca todos os botões
    await user.click(btns[1]); // Simula um clique no segundo botão

    expect(alertFn).toHaveBeenCalledExactlyOnceWith('falha ao apagar todo'); // Espero que o alert tenha sido chamado exatamente 1 vez com a mensagem de erro
  });

  test('não deve chamar a action se o ID for inválido, vazio ou formado apenas com espaços', async () => { // O que o teste verifica: se a action NÃO é chamada quando o ID é inválido
    const { action } = renderList({ // Renderiza a lista com uma tarefa de ID inválido
      todos: [{ id: '     ', description: '', createdAt: '' }], // ID formado apenas por espaços
    });

    const item = screen.getByRole('listitem'); // Busca o item da lista
    const btn = within(item).getByRole('button'); // Busca o botão DENTRO do item

    await user.click(btn); // Simula um clique no botão

    expect(action).not.toHaveBeenCalled(); // Espero que a action NÃO tenha sido chamada
  });
});

type RenderListProps = { // Cria um type para as props da função renderList
  delay?: number; // delay: opcional, número (tempo de espera em ms)
  success?: boolean; // success: opcional, booleano (true = sucesso, false = erro)
  todos?: Todo[]; // todos: opcional, array de tarefas
};

function renderList({ // Função que renderiza o TodoList com uma action simulada
  delay = 0, // delay: valor padrão é 0 (sem delay)
  success = true, // success: valor padrão é true (sucesso)
  todos = mockTodos, // todos: valor padrão é mockTodos (tarefas simuladas)
}: RenderListProps = {}) { // O `= {}` permite chamar a função sem parâmetros
  const newTodos = [...todos]; // Cria uma cópia do array de tarefas (para não modificar o original)
  const actionSuccessResult = { // Objeto que simula uma resposta de SUCESSO
    success: true, // success: true (operação bem-sucedida)
    todo: { id: 'id', description: 'desc', createdAt: 'createdAt' }, // Tarefa com dados simulados
  };
  const actionErrorResult = { // Objeto que simula uma resposta de ERRO
    success: false, // success: false (operação falhou)
    errors: ['falha ao apagar todo'], // Array de erros
  };
  const actionResult = success ? actionSuccessResult : actionErrorResult; // Escolhe entre sucesso e erro com base no parâmetro 'success'
  const actionNoDelay = vi.fn().mockResolvedValue(actionResult); // Função mock que retorna o resultado IMEDIATAMENTE (sem delay)
  const actionDelayed = vi.fn().mockImplementation(async () => { // Função mock que retorna o resultado APÓS um delay
    await new Promise(r => setTimeout(r, delay)); // Espera o tempo do delay
    return actionResult; // Retorna o resultado (sucesso ou erro)
  });
  const action = delay > 0 ? actionDelayed : actionNoDelay; // Escolhe entre a action COM delay e SEM delay com base no parâmetro 'delay'

  const renderResult = render(<TodoList action={action} todos={newTodos} />); // Renderiza o TodoList passando a action e as tarefas

  return { action, renderResult, todos: newTodos }; // Retorna a action, o resultado da renderização e as tarefas
}
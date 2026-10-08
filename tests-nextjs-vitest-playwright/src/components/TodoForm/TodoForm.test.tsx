import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { TodoForm } from '.';

const user = userEvent.setup();

describe('<TodoForm /> (integration', () => {
  test('deve renderizar todos os componentes do form', async () => {
    const { input, btn } = renderForm();
    expect(input).toBeInTheDocument();
    expect(btn).toBeInTheDocument();
  });
  test('deve chamar a action com os valores corretos', async () => {
    const { action, input, btn } = renderForm();
    await user.type(input, 'tarefa');
    await user.click(btn);
    expect(action).toHaveBeenCalledExactlyOnceWith('tarefa');
  });
  test('deve cortar espaços do inicio e fim da description ', async () => {
    const { action, input, btn } = renderForm();
    await user.type(input, '    tarefa  ');
    await user.click(btn);
    expect(action).toHaveBeenCalledExactlyOnceWith('tarefa');
  });
  test('deve limpar o input se o formulário retornar sucesso', async () => {
    const { input, btn } = renderForm();
    await user.type(input, 'tarefa');
    await user.click(btn);
    expect(input).toHaveValue('');
  });
  test('deve desativar o botão enquanto envia a action', async () => {
    const { input, btn } = renderForm({ delay: 7 });
    await user.type(input, 'tarefa');
    await user.click(btn);

    await waitFor(() => expect(btn).toBeDisabled());
    await waitFor(() => expect(btn).toBeEnabled());
  });
  test('deve desativar o input enquanto envia a action', async () => {
    const { input, btn } = renderForm({ delay: 20 });
    await user.type(input, 'tarefa');
    await user.click(btn);

    await waitFor(() => expect(input).toBeDisabled());
    await waitFor(() => expect(input).toBeEnabled());
  });
  test('deve trocar o texto do botão enquanto envia a action', async () => {
    const { btn, input } = renderForm({ delay: 20 });
    await user.type(input, 'tarefa');
    await user.click(btn);

    await waitFor(() => expect(btn).toHaveAccessibleName('Criando tarefa...'));
    await waitFor(() => expect(btn).toHaveAccessibleName('Criar tarefa'));
  });
  test('deve mostrar o erro quando a action retornar erro', async () => {
    const { input, btn } = renderForm({ success: false });
    await user.type(input, 'tarefa');
    await user.click(btn);

    const error = await screen.findByRole('alert');

    expect(error).toHaveTextContent('falha ao criar todo');
    expect(input).toHaveAttribute('aria-describedby', error.id);
  });
  test('deve manter o texto dgitado no input se a action retornar erro', async () => {
    const { input, btn } = renderForm({ success: false });
    await user.type(input, 'tarefa');
    await user.click(btn);

    expect(input).toHaveValue('tarefa')
  });
});

type RenderForm = {
  // Type que define as opções da função renderForm
  delay?: number; // delay: opcional, número (tempo de espera em ms)
  success?: boolean; // success: opcional, booleano (true = sucesso, false = erro)
};

function renderForm({ delay = 0, success = true }: RenderForm = {}) {
  // Função que renderiza o TodoForm com uma action simulada, O `= {}` permite chamar a função sem parâmetros (usa os valores padrão)
  const actionSuccessResult = {
    //ação de sucesso
    success: true, // success: true (operação bem-sucedida)
    todo: { id: 'id', description: 'description', createdAt: 'createdAt' }, //a tarefa com o objeto com seus valores cirada com sucesso
  };

  const actionErrorResult = {
    //agora uma ação de erro
    success: false, //sucesso como false já que a operação falhou
    errors: ['falha ao criar todo'], //array de erro com esse valor
  };

  const actionResult = success ? actionSuccessResult : actionErrorResult; //agora vou pegar as duas ações e determinar qual vou usar a partir do valor success

  const actionNoDelay = vi.fn().mockResolvedValue(actionResult); //Função mock que retorna o resultado IMEDIATAMENTE (sem delay)
  const actionDelayed = vi.fn().mockImplementation(async () => {
    // Função mock que retorna o resultado APÓS um delay
    await new Promise(r => setTimeout(r, delay)); // Espera o tempo do delay
    return actionResult; // Retorna o resultado (sucesso ou erro)
  });
  const action = delay > 0 ? actionDelayed : actionNoDelay; // Escolhe entre a action COM delay e SEM delay com base no parâmetro 'delay'

  render(<TodoForm action={action} />); // Renderiza o TodoForm passando a action como prop

  const input = screen.getByLabelText('Tarefa'); // Busca o input pelo label 'Tarefa'
  const btn = screen.getByRole('button'); // Busca o botão pela role 'button'

  return { btn, input, action }; //retorno meu botão, meu input e minha action
}

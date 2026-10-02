import userEvent from '@testing-library/user-event'; // Importa o userEvent para simular interações do usuário (cliques, digitação, etc)
import { InputText, InputTextProps } from '.'; // Importa o componente InputText e o type das props
import { render, screen } from '@testing-library/react'; // Importa as funções render e screen da Testing Library

type Props = Partial<InputTextProps>; //como não quero ser forçado a usar todas as props de InputTextProps, uso o partial para usar somente partes desse type, e guardo isso no outro type Props

const makeInput = (p: Props = {}) => { //crio um input para teste
  //como não quero ser forçado a usar todas as props aqui também, falo que meu parametro p que é do type Props tem um objeto vazio
  return ( //e retorno um input com os atributos que quero
    <InputText
      labelText='label' // labelText padrão
      placeholder='placeholder' // placeholder padrão
      type='text' // type padrão (texto)
      disabled={false} // disabled padrão (ativo)
      required={true} // required padrão (obrigatório)
      readOnly={false} // readOnly padrão (editável)
      {...p} // Sobrescreve com as props passadas (p)
    />
  );
};

const renderInput = (p?: Props) => {  // Função que renderiza o InputText e busca o input
  const renderResult = render(makeInput(p)); // Renderiza o input de teste com as props passadas (p)
  const input = screen.getByRole('textbox'); // Busca o elemento <input> pela role 'textbox' 
  return { // Retorna um objeto com:
    input, // O elemento <input>
    renderResult, // O resultado da renderização
  };
};

const input = (p?: Props) => renderInput(p).input; // Função que chama renderInput e retorna apenas o input

describe('<InputText />', () => { //descrição do que estou tenstando, nesse caso vai ser meu componente input 
  describe('comportamento padrão', () => { /// Sub-descrição: testa o comportamento padrão do input
    test('renderiza com label', async () => {// o que o teste deve fazer 
      const el = input({ labelText: 'novo label' }); // Renderiza o input com labelText 'novo label' e pega o elemento
      const label = screen.getByText('novo label'); // Busca o texto 'novo label' no DOM (o label)
      expect(el).toBeInTheDocument(); // Espero que o input exista no DOM
      expect(label).toBeInTheDocument(); // Espero que o label exista no DOM com o texto correto
    });

    test('renderiza com placeholder', async () => { //o que o teste tem que fazer
      const el = input({ placeholder: 'novo placeholder' }); // Renderiza o input com placeholder 'novo placeholder' e pega o elemento
      expect(el).toHaveAttribute('placeholder', 'novo placeholder');//// Espero que o input tenha o atributo placeholder com o texto correto
    });

    test('renderiza sem placeholder', async () => {//o que o teste tem que fazer
      const el = input({ placeholder: undefined });   // Renderiza o input sem placeholder (undefined)
      expect(el).not.toHaveAttribute('placeholder'); // Espero que o input NÃO tenha o atributo placeholder
    });

    test('renderiza sem label', async () => {//o que o teste tem que fazer
      input({ labelText: undefined }); // Renderiza o input sem labelText (undefined)
      const label = screen.queryByRole('novo label');// Busca o texto 'label' no DOM (o label padrão do makeInput)

      expect(label).not.toBeInTheDocument(); // Espero que o label NÃO exista no DOM
    });

    test('usa labelText como aria-label quando possível', async () => { //o que meu teste deve fazer
      expect(input()).toHaveAttribute('aria-label', 'label'); // Renderiza o input e espero que o aria-label seja 'label' (o labelText padrão)
    });

    test('usa placeholder como fallback de aria-label', async () => { //o que meu teste deve fazer
      expect(input({ labelText: undefined })).toHaveAttribute( // Renderiza o input sem labelText e espero que o aria-label seja 'placeholder'
        'aria-label',
        'placeholder',
      );
    });

    test('exibe o valor padrão corretamente', async () => { //o que meu teste deve fazer
      expect(input({ defaultValue: 'valor' })).toHaveValue('valor'); // Renderiza o input com defaultValue 'valor' e espero que o input tenha esse valor
    });

    test('aceita outras props do JSX (name, maxLength)', async () => {//o que meu teste deve fazer
      const el = input({ name: 'name', maxLength: 10 }); //renderizo meu input com o elemento name e maxLength 
      expect(el).toHaveAttribute('name', 'name'); //espero que meu input tenha um atribute name com o texto name
      expect(el).toHaveAttribute('maxLength', '10'); //espero que meu input tenha um atribute maxLength com o valor 10
    });
  });

  describe('acessibilidade', () => {// Sub-descrição: testa a acessibilidade do input
    test('não exibe mensagem de erro por padrão', async () => {// o que meu teste deve fazer
      const el = input(); //renderizo o input 
      expect(el).toHaveAttribute('aria-invalid', 'false');// Espero que o input tenha aria-invalid='false' (válido)
      expect(el).not.toHaveAttribute('aria-describedby'); // Espero que o input NÃO tenha aria-describedby (sem descrição de erro)
      expect(screen.queryByRole('alert')).not.toBeInTheDocument(); // Espero que o alert NÃO esteja no DOM. Uso queryByRole porque ele retorna null se não encontrar; o getByRole lançaria erro e quebraria o teste
    });

    test('não marca o input como inválido por padrão', async () => { //o que meu teste tem que fazer
      const el = input(); //renderizo meu input
      expect(el).toHaveAttribute('aria-invalid', 'false'); //espero que meu input tenha area-invalid como false 
    });

    test('renderiza mensagem de erro quando `errorMessage` é passada', async () => { // o que meu teste deve fazer
      const el = input({ errorMessage: 'tem erro' }); // Renderiza o input com errorMessage='tem erro'
      const error = screen.getByRole('alert'); // Busca o elemento com role='alert' (a mensagem de erro)
      const errorId = error.getAttribute('id'); // Pega o ID do elemento de erro
      
      expect(el).toHaveAttribute('aria-invalid', 'true'); //espero que meu input tenha a aria-invalid como true, isso quer dizer que tem erro
      expect(el).toHaveAttribute('aria-describedby', errorId); // Espero que o input tenha aria-describedby com o ID do erro 
      expect(error).toBeInTheDocument(); // Espero que o alert exista no DOM
    });

    describe('comportamento interativo', () => { // Sub-descrição: testa o comportamento interativo do input
      test('atualia o valor conforme o usuário digita', async () => { //o que meu teste deve fazer
        const user = userEvent.setup(); // Configura o userEvent (simula interações do usuário)
        const el = input(); //renderizo meu input
        await user.type(el, 'texto'); // Simula o usuário digitando 'texto' no input
        expect(el).toHaveValue('texto');  // Espero que o input tenha o valor 'texto'
      });
    });

    describe('estados visuais', () => {
      test('aplica classes visuais quando desabilitado ', async () => {
        const el = input({ disabled: true });
        expect(el).toHaveClass('disabled:bg-slate-200 disabled:text-slate-400');
      });

      test('aplica classes visuais quando readonly', async () => {
        const el = input({ readOnly: true });
        expect(el).toHaveClass('read-only:bg-slate-100');
      });

      test('adiciona classe de erro (ring vermelha) quando inválido', async () => {
        const el = input({ errorMessage: 'Erro' });
        expect(el).toHaveClass('ring-red-500 focus:ring-red-700');
      });

      test('mantém classes personalizadas do desenvolvedor', async () => {
        const el = input({ className: 'custom' });
        expect(el).toHaveClass('custom' );
      });
    });
  });
});

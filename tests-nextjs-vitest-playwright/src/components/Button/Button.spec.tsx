//OS SELETORES USADOS NESSE TESTE FORAM APENAS COMO EXEMPLO
//TENTAR SEMPRE USAR A ORDEM INDICA PELA ANOTAÇÕES 

import { render, screen } from '@testing-library/react'; // Importa as funções render e screen da Testing Library
import { Button } from '.'; // Importa o componente Button
import { userEvent } from '@testing-library/user-event';

const VARIANT_DEFAULT_CLASSES = 'bg-blue-600 hover:bg-blue-700 text-blue-100';
const VARIANT_DANGER_CLASSES = 'bg-red-600 hover:bg-red-700 text-red-100';
const VARIANT_GHOST_CLASSES = 'bg-slate-300 hover:bg-slate-400 text-slate-950';
const SIZE_DEFAULT_CLASSES =
  'text-base/tight py-2 px-4 rounded-md [&_svg]:w-4 [&_svg]:h-4 gap-2';

const SIZE_SM_CLASSES = 'text-xs/tight py-1 px-2 rounded-sm [&_svg]:w-3 [&_svg]:h-3 gap-1';
const SIZE_MD_CLASSES = 'text-base/tight py-2 px-4 rounded-md [&_svg]:w-4 [&_svg]:h-4 gap-2'
const SIZE_LG_CLASSES = 'text-lg/tight py-4 px-6 rounded-lg [&_svg]:w-5 [&_svg]:h-5 gap-3'
const DISABLED_CLASSES = 'disabled:bg-slate-200 disabled:text-slate-400 disabled:cursor-not-allowed'// Cursor não permitido quando desabilitado


describe('<Button />', () => {
  //descrição do que irei testar, nesse caso vai ser meu componente Button
  describe('props padrão e JSX', () => {
    /// Sub-descrição: testa as props padrão e o JSX do botão
    test('deve renderizar o botão com props padrão (apenas com children)', async () => {
      //o que o teste ira fazer
      render(<Button>Enviar formulário</Button>); // Renderiza o componente Button no DOM virtual com o texto "Enviar formulário"

      const button = screen.getByRole('button', {
        // Busca o elemento <button> no DOM pelo seu papel (role)
        name: /enviar formulário/i, //// E pelo texto (usando regex para ignorar maiúsculas/minúsculas)
      });

      expect(button).toBeInTheDocument(); // Espero que o elemento exista no DOM
      expect(button).toHaveClass(VARIANT_DEFAULT_CLASSES); // Espero que o elemento tenha as classes da variante 'default'
      expect(button).toHaveClass(
        // Espero que o elemento tenha as classes do tamanho 'md'
        SIZE_DEFAULT_CLASSES,
      );
    });

    test('verifica se as propriedades padrão do JSX funcionam corretamente', async () => { //o que meu teste deve fazer
      const handleClick = vi.fn(); // Simulo uma função que não faz nada (apenas registra chamadas)
      render(<Button onClick={handleClick} type='submit' aria-hidden='false'>  { /*Renderiza o componente Button no DOM virtual com o texto "Enviar formulário"/*/}
          Enviar formulário
        </Button>,
      ); 

      const button = screen.getByText('Enviar formulário'); //busco o elemento texto que tem dentro do meu botão
      await userEvent.click(button); // Simulo um clique no botão que eu busquei pelo texto 
      await userEvent.click(button); // Simulo um clique no botão que eu busquei pelo texto 

      expect(handleClick).toHaveBeenCalledTimes(2); //quando eu clico no botão disparo a função handleClick, então eu espero que essa função tenha sido chamada duas vezes
      expect(button).toHaveAttribute('type', 'submit'); //espero que meu button tenha o atributo type='submit'
      expect(button).toHaveAttribute('aria-hidden', 'false');  //espero que meu button tenha o atributo aria-hidden='false'
    });
  });

  describe('variants (cores)', () => {// Descrição desse novo trecho de testes (variantes de cor)
    test('checa se default aplica a cor correta', async () => { //o que meu teste deve fazer
      render( <Button variant='default' title='o botão'> {/* Renderiza o Button com variant='default' e title='o botão' */}
          Enviar formulário
        </Button>,
      ); 

      const button = screen.getByTitle('o botão'); //busco o meu botão pelo title dele 
      expect(button).toHaveClass(VARIANT_DEFAULT_CLASSES); // Espero que o button tenha as classes da variante 'default'
    });

    test('checa se danger aplica a cor correta', async () => { //o que meu teste deve fazer
      render(<Button variant='danger' title='o botão'>{ /*Renderiza o componente Button no DOM virtual com o texto "Enviar formulário"/*/}
          Enviar formulário
        </Button>,
      ); 

      const button = screen.getByTitle('o botão'); //pego o meu botão pelo title dele 
      expect(button).toHaveClass(VARIANT_DANGER_CLASSES); // Espero que o elemento tenha as classes da variante 'danger'
    });

      test('checa se ghost aplica a cor correta', async () => {//o que meu teste deve fazer
        render(<Button variant='ghost' title='o botão' >{ /*Renderiza o componente Button no DOM virtual com o texto "Enviar formulário"/*/}
                Enviar formulário
            </Button>
        )
        const button = screen.getByTitle('o botão') //pego o meu botão pelo title dele 
        expect(button).toHaveClass(VARIANT_GHOST_CLASSES)// Espero que o elemento tenha as classes da variante 'ghost'
      });
    });

    describe('size (tamanhos)', () => { // Descrição desse novo trecho de testes (variantes de tamanhos)
      test('tamanho sm deve ser menor', async () => {
        render(<Button size="sm" title='o botão'>{ /*Renderiza o componente Button no DOM virtual com o texto "Enviar formulário"/*/}
          Enviar formulário
        </Button>,
      ); 

      const button = screen.getByTitle('o botão'); //pego o meu botão pelo title dele 
      expect(button).toHaveClass(SIZE_SM_CLASSES); // Espero que o elemento tenha as classes do tamanho 'sm'
      });

      test('tamanho md deve ser médio', async () => {

        render(<Button size="md" title='o botão'>{ /*Renderiza o componente Button no DOM virtual com o texto "Enviar formulário"/*/}
          Enviar formulário
        </Button>,
      ); 

      const button = screen.getByTitle('o botão'); //pego o meu botão pelo title dele 
      expect(button).toHaveClass(SIZE_MD_CLASSES); // Espero que o elemento tenha as classes do tamanho 'md'
      });

      test('tamanho lg deve ser grande', async () => {
         render(<Button size="lg" title='o botão'>{ /*Renderiza o componente Button no DOM virtual com o texto "Enviar formulário"/*/}
          Enviar formulário
        </Button>,
      ); 

      const button = screen.getByTitle('o botão'); //pego o meu botão pelo title dele 
      expect(button).toHaveClass(SIZE_LG_CLASSES); // Espero que o elemento tenha as classes do tamanho 'lg'
      });
    });

    describe('disabled', () => { // Descrição desse novo trecho de testes (verificação de botão desativado)
      test('classes para estado desativado estão corretas', async () => {
        render(<Button disabled>{ /*Renderiza o componente Button no DOM virtual com o texto "Enviar formulário"/*/}
          Enviar formulário
        </Button>,
      ); 

      const button = screen.getByRole('button', {name: /enviar formulário/i }); //pego o meu botão pela role dele, e pelo name que tem dentro dele
      expect(button).toHaveClass(DISABLED_CLASSES); // Espero que o elemento tenha a classe de botão desabilitado 
      expect(button).toBeDisabled() //espero também que esse botão esteja desabilitado
      });
    });
  });

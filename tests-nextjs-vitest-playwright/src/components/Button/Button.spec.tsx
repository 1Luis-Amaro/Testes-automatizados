import { render, screen } from "@testing-library/react"; // Importa as funções render e screen da Testing Library
import { Button } from "."; // Importa o componente Button

describe('<Button />', () => { //descrição do que irei testar, nesse caso vai ser meu componente Button
  describe('props padrão e JSX', () => { /// Sub-descrição: testa as props padrão e o JSX do botão 
    test('deve renderizar o botão com props padrão (apenas com children)', async () => { //o que o teste ira fazer
      render(<Button>Enviar formulário</Button>); // Renderiza o componente Button no DOM virtual com o texto "Enviar formulário"

      const button = screen.getByRole('button', { // Busca o elemento <button> no DOM pelo seu papel (role)
        name: /enviar formulário/i //// E pelo texto (usando regex para ignorar maiúsculas/minúsculas)
      })

      expect(button).toBeInTheDocument() // Espero que o elemento exista no DOM
      expect(button).toHaveClass('bg-blue-600 hover:bg-blue-700 text-blue-100')  // Espero que o elemento tenha as classes da variante 'default'
      expect(button).toHaveClass( // Espero que o elemento tenha as classes do tamanho 'md'
        'text-base/tight py-2 px-4 rounded-md [&_svg]:w-4 [&_svg]:h-4 gap-2')
    });

    // test('verifica se as propriedades padrão do JSX funcionam corretamente', async () => {});
  });

  // describe('variants (cores)', () => {
  //   test('checa se default aplica a cor correta', async () => {});

  //   test('checa se danger aplica a cor correta', async () => {});

  //   test('checa se ghost aplica a cor correta', async () => {});
  // });

  // describe('size (tamanhos)', () => {
  //   test('tamanho sm deve ser menor', async () => {});

  //   test('tamanho md deve ser médio', async () => {});

  //   test('tamanho lg deve ser grande', async () => {});
  // });

  // describe('disabled', () => {
  //   test('classes para estado desativado estão corretas', async () => {});
  // });
});
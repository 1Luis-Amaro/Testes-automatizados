import { render } from "@testing-library/react";
import { Button } from ".";

describe('<Button />', () => {
  describe('props padrão e JSX', () => {
    test('deve renderizar o botão com props padrão (apenas com children)', async () => {
      const r = render(<Button>Enviar formulário</Button>);

      r.debug()
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
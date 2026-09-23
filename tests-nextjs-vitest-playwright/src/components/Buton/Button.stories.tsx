import { Button } from '.'; // Importa o componente Button
import type { Meta, StoryObj } from '@storybook/react'; // Importa os tipos Meta e StoryObj do Storybook

const meta = { // Objeto que define as configurações da história (story)
  component: Button, // O componente que será documentado/testado (Button)
  decorators: [ // Array de decorators (envolvem a história com layout/estilo extra)
    Story => (// Cada decorator é uma função que recebe a história (Story) e retorna JSX
      <div className='max-w-screen-md mx-auto p-12 flex items-center justify-center'> {/* Div com CSS para centralizar o botão */}
        <Story /> {/* Renderiza a história (o botão) dentro da div */}
      </div>
    ),
  ],
} satisfies Meta<typeof Button>;// Verifica se o objeto `meta` está de acordo com o tipo `Meta<typeof Button>` (sem perder a tipagem literal)

export default meta; // Exporta o objeto `meta` como padrão (obrigatório para o Storybook)

type Story = StoryObj<typeof Button>; // Cria um tipo `Story` baseado no tipo `StoryObj` do Storybook, usando o componente Button

export const Default: Story = {   // Cria uma história chamada "Default" (padrão)
  args: { /// Props que serão passadas para o componente Button
  children: 'Olá mundo', // children: o texto que aparece dentro do botão
    variant: 'default', // variant: a variante padrão (azul)
    size: 'lg', // size: o tamanho grande
  },
};

export const Danger: Story = { // Cria uma história chamada "Danger" (perigo)
  args: { // Props que serão passadas para o componente Button
    children: 'Olá mundo', // children: o texto que aparece dentro do botão
    variant: 'danger', // variant: a variante de perigo (vermelho)
    size: 'lg', // size: o tamanho grande
  },
};

export const Ghost: Story = { // Cria uma história chamada "Ghost" (fantasma)
  args: { // Props que serão passadas para o componente Button
    children: 'Olá mundo', // children: o texto que aparece dentro do botão
    variant: 'ghost', // variant: a variante ghost (cinza)
    size: 'lg', // size: o tamanho grande
  },
};
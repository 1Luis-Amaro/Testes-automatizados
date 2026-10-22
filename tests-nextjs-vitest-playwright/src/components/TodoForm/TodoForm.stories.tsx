import { TodoForm } from '.'; // Importa o componente TodoForm
import type { Meta, StoryObj } from '@storybook/react'; // Importa os tipos Meta e StoryObj do Storybook
import { todoActionStoryMock } from '@/core/__tests__/utils/todo-action-story';

const meta: Meta<typeof TodoForm> = {// Objeto que define as configurações globais das stories para o componente TodoForm
  title: 'Components/Forms/TodoForm', // Título que aparece no menu lateral do Storybook
  component: TodoForm, // O componente que será documentado/testado
  decorators: [// Array de decorators (envolvem a história com layout/estilo extra)
    Story => (// Cada decorator é uma função que recebe a história (Story) e retorna JSX
      <div className='max-w-screen-md mx-auto p-12'>  {/* Div com CSS para centralizar o botão */}
        <Story /> {/* Renderiza a história (o input) dentro da div */}
      </div>
    ),
  ],
  argTypes: { // Configura como cada prop aparece no painel de controles (Controls)
    action: { /// Configuração da prop 'action'
      control: false, // Desabilita o controle para a prop 'action' (porque é uma função, não um valor editável)
    },
  },
};

export default meta; // Exporta o objeto meta como padrão (obrigatório para o Storybook)

type Story = StoryObj<typeof TodoForm>;  // Cria um tipo Story baseado no StoryObj, usando o componente TodoForm

export const Default: Story = { // Cria uma story chamada "Default" (padrão)
  args: {  // Props que serão passadas para o componente TodoForm
    action: todoActionStoryMock.create.success
  },
};

export const WithError: Story = {// Cria uma story chamada "WithError" (com erro)
  args: {  // Props que serão passadas para o componente TodoForm
    action: todoActionStoryMock.create.error
  },
};
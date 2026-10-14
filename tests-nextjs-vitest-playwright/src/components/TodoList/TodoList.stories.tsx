import { todoActionStoryMock } from '@/core/__tests__/utils/todo-action-story'; // Importa as actions simuladas (mock)
import { TodoList } from '.'; // Importa o componente TodoList
import type { Meta, StoryObj } from '@storybook/react'; // Importa os tipos Meta e StoryObj do Storybook
import { mockTodos } from '@/core/__tests__/mocks/todo'; // Importa as tarefas simuladas (mock)

const meta: Meta<typeof TodoList> = { // Objeto que define as configurações globais das stories para o componente TodoList
  title: 'Components/Lists/TodoList', // Título que aparece no menu lateral do Storybook
  component: TodoList, // O componente que será documentado/testado
  decorators: [ // Array de decorators (envolvem a história com layout/estilo extra)
    Story => ( // Cada decorator é uma função que recebe a história (Story) e retorna JSX
      <div className='max-w-screen-md mx-auto p-12'> {/* Div com CSS para centralizar a lista */}
        <Story /> {/* Renderiza a história (a lista) dentro da div */}
      </div>
    ),
  ],
  argTypes: { // Configura como cada prop aparece no painel de controles (Controls)
    todos: { control: false }, // Desabilita o controle (é um array, não editável)
    action: { control: false },  // Desabilita o controle (é uma função, não editável)
  },
};

export default meta; // Exporta o objeto meta como padrão (obrigatório para o Storybook

type Story = StoryObj<typeof TodoList>; // Cria um tipo Story baseado no StoryObj, usando o componente TodoList

export const Default: Story = { // Cria uma story chamada "Default" (padrão)
  args: { // Props que serão passadas para o componente TodoList 
    todos: mockTodos, //passo minhas tarefas que criei manualmente para testar
    action: todoActionStoryMock.delete.success, //pego a função que tem a action simulada que criei para esse story, nesse caso vai ser a de sucesso quando tentar deletar
  },
};

export const WithError: Story = { /// Cria uma story chamada "WithError" (com erro)
  args: { // Props que serão passadas para o componente TodoList
    todos: mockTodos, //passo minhas tarefas que criei manualmente para testar
    action: todoActionStoryMock.delete.error,//pego a função que tem a action simulada que criei para esse story, nesse caso vai ser a de erro quando tentar deletar
  },
};

export const Delayed: Story = { // Cria uma story chamada "Delayed" (com atraso)
  args: { // Props que serão passadas para o componente TodoList
    todos: mockTodos, //passo minhas tarefas que criei manualmente para testar
    action: todoActionStoryMock.delete.delayed, //pego a função que tem a action simulada que criei para esse story, nesse caso vai ser a de delay quando tentar deletar
  },
};

export const NoTodos: Story = { // Cria uma story chamada "NoTodos" (sem tarefas)
  args: {  // Props que serão passadas para o componente TodoList
    todos: [], //array de tarefas vazio 
    action: todoActionStoryMock.delete.success, //pego a função que tem a action simulada que criei para esse story, nesse caso vai ser a de sucesso quando tentar deletar
  },
};
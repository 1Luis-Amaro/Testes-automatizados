import { CreateTodoAction } from '@/core/todo/actions/todo.action.types'; // Importa o tipo da ação de criar tarefa
import { TodoForm } from '.'; // Importa o componente TodoForm
import type { Meta, StoryObj } from '@storybook/react'; // Importa os tipos Meta e StoryObj do Storybook
import { fn } from '@storybook/test'; // Importa a função 'fn' (função simulada) do Storybook

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
    action: fn(async () => { // A prop 'action' recebe uma função simulada (mock) do Storybook
      return { // Retorno da função simulada (simula sucesso)
        success: true,  // success: true (operação bem-sucedida)
        todo: { id: 'id', description: 'desc', createdAt: 'data' },// simulo uma tarefa com sucesso 
      };
    }) as CreateTodoAction, // Força o tipo da função como CreateTodoAction (cast)
  },
};

export const WithError: Story = {// Cria uma story chamada "WithError" (com erro)
  args: {  // Props que serão passadas para o componente TodoForm
    action: fn(async () => { // A prop 'action' recebe uma função simulada (mock) do Storybook
      return { // Retorno da função simulada (simula erro)
        success: false, //sucess como false ja que deu erro
        errors: ['falha ao criar todo'], /// Array de erros
      };
    }) as CreateTodoAction,  // Força o tipo da função como CreateTodoAction (cast)
  },
};
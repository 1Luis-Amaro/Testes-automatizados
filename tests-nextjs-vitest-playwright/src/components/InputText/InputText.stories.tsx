import { InputText } from '.'; // Importa o componente InputText do arquivo index da pasta
import type { Meta, StoryObj } from '@storybook/react'; // Importa os tipos Meta e StoryObj do Storybook

const meta: Meta<typeof InputText> = { // Crio um objeto do tipo Meta, usando o componente InputText como referência
  title: 'Components/Forms/InputText', // Define o título que aparece no menu lateral do Storybook (pasta Components > Forms > InputText)
  component: InputText, // Define o componente que será documentado/testado (InputText)
  decorators: [ // Array de decorators (envolvem a história com layout/estilo extra)
    Story => ( // Função que recebe a história (Story) e retorna JSX
      <div className='max-w-screen-lg mx-auto p-12'> {/* Div com CSS para centralizar o input */}
        <Story /> {/* Renderiza a história (o input) dentro da div */}
      </div>
    ),
  ],
  tags: ['autodocs'], // Ativa a geração automática de documentação (autodocs) para este componente
  argTypes: { // Configura como cada prop aparece no painel de controles (Controls) do Storybook
    type: { // Configuração da prop 'type'
      control: 'select', // Exibe um dropdown (select) para escolher o valor
      options: ['text', 'password', 'email', 'tel', 'url', 'search'], // Opções disponíveis no dropdown
      description: 'Esse é o tipo do input', // Descrição que aparece ao passar o mouse
    },
    labelText: { // Configuração da prop 'labelText'
      control: 'text', // Exibe um campo de texto para digitar o valor
      description: 'O label do input', // Descrição que aparece ao passar o mouse
    },
    errorMessage: { // Configuração da prop 'errorMessage'
      control: 'text', // Exibe um campo de texto para digitar o valor
      description: 'Mensagem de erro ao usuário', // Descrição que aparece ao passar o mouse
    },
    placeholder: { // Configuração da prop 'placeholder'
      control: 'text', // Exibe um campo de texto para digitar o valor
      description: 'Um exemplo de uso para o input', // Descrição que aparece ao passar o mouse
    },
    required: { // Configuração da prop 'required'
      control: 'boolean', // Exibe um checkbox (true/false) para escolher o valor
      description: 'O campo é requerido', // Descrição que aparece ao passar o mouse
    },
    disabled: { // Configuração da prop 'disabled'
      control: 'boolean', // Exibe um checkbox (true/false) para escolher o valor
      description: 'Campo está desativado', // Descrição que aparece ao passar o mouse
    },
    readOnly: { // Configuração da prop 'readOnly'
      control: 'boolean', // Exibe um checkbox (true/false) para escolher o valor
      description: 'Apenas leitura', // Descrição que aparece ao passar o mouse
    },
  },
};

export default meta; // Exporta o objeto meta como padrão (obrigatório para o Storybook)

type Story = StoryObj<typeof InputText>; // Cria um tipo Story baseado no StoryObj, usando o componente InputText

export const Default: Story = { // Cria uma história chamada "Default" (padrão)
  args: { // Props que serão passadas para o componente InputText
    type: 'text', // type: tipo do input (texto)
    labelText: 'Input Label', // labelText: rótulo do input
    errorMessage: '', // errorMessage: mensagem de erro (vazia, sem erro)
    placeholder: 'Digite algo...', // placeholder: texto de exemplo
    required: true, // required: o campo é obrigatório
    disabled: false, // disabled: o campo está ativo
    readOnly: false, // readOnly: o campo pode ser editado
    defaultValue: 'Este é o valor padrão do input', // defaultValue: valor inicial do input
  },
};

export const WithError: Story = { // Cria uma história chamada "WithError" (com erro)
  args: { // Props que serão passadas para o componente InputText
    ...Default.args, // Herda todas as props da história "Default"
    errorMessage: 'Essa é a mensagem de erro', // errorMessage: mensagem de erro (para mostrar o estado de erro)
  },
};

export const Disabled: Story = { // Cria uma história chamada "Disabled" (desabilitado)
  args: { // Props que serão passadas para o componente InputText
    ...Default.args, // Herda todas as props da história "Default"
    disabled: true, // disabled: o campo está desabilitado
  },
};

export const ReadOnly: Story = { // Cria uma história chamada "ReadOnly" (somente leitura)
  args: { // Props que serão passadas para o componente InputText
    ...Default.args, // Herda todas as props da história "Default"
    readOnly: true, // readOnly: o campo é somente leitura
  },
};
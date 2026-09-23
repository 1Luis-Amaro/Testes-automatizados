import React from 'react'; // Importa o React (necessário para usar JSX)
import type { Preview } from '@storybook/react'; // Importa o tipo Preview do Storybook (define a configuração global do preview)

import '../src/app/globals.css'; // Importa o CSS global do projeto (Tailwind, etc). O ../ volta um nível (sai de .storybook/ e entra em src/app/)
import './storybook.css'; // Importa o CSS específico do Storybook (mesma pasta .storybook/)

const preview: Preview = { // Crio um objeto do tipo Preview (configuração global do Storybook)
  parameters: { // Parâmetros globais que afetam TODAS as histórias
    backgrounds: { // Configuração dos fundos (backgrounds) disponíveis no Storybook
      values: [ // Lista de fundos disponíveis
        // { name: 'dark', value: '#000000' }, // Fundo escuro (comentado, não está ativo)
        { name: 'light', value: 'ffffff' }, // Fundo claro (branco) - nome: 'light', valor: 'ffffff'
      ],
      default: 'light', // Fundo padrão quando uma história é aberta (light)
    },
    controls: { // Configuração dos controles (painel de edição de props)
      matchers: { // Define como os controles são exibidos com base no tipo de dado
        color: /(background|color)$/i, // Se a prop tiver 'background' ou 'color' no nome, exibe um seletor de cor
        date: /Date$/i, // Se a prop tiver 'Date' no nome, exibe um seletor de data
      },
    },
  },
  decorators: [Story => <Story />], // Decorator global: envolve TODAS as histórias (aqui não adiciona nada, só renderiza a história)
};

export default preview; // Exporta o objeto preview como padrão (obrigatório para o Storybook)
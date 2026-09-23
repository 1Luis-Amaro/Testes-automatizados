import type { StorybookConfig } from '@storybook/nextjs'; // Importa o tipo StorybookConfig do Storybook para o Next.js

const config: StorybookConfig = { // Crio um objeto do tipo StorybookConfig (configuração principal do Storybook)
  stories: [ // Define ONDE o Storybook vai procurar as histórias (stories)
    '../src/**/*.stories.@(js|jsx|ts|tsx)', // Procura por arquivos que terminam com .stories.ts, .stories.tsx, .stories.js ou .stories.jsx em qualquer pasta dentro de src/
    '../src/**/stories.@(js|jsx|ts|tsx)', // Procura por arquivos que estão dentro de uma pasta chamada 'stories' (ex: src/stories/Button.tsx)
  ],
  addons: ['@storybook/addon-essentials'], // Lista de addons (extensões) do Storybook. O '@storybook/addon-essentials' inclui: controls, actions, viewport, backgrounds, toolbars, measure, outline
  framework: '@storybook/nextjs', // Define o framework que o Storybook vai usar (Next.js)
  staticDirs: ['../public'], // Define pastas de arquivos estáticos (imagens, fontes, etc) que serão servidas pelo Storybook. O '../public' é a pasta public do Next.js
  features: { // Configurações de funcionalidades do Storybook
    backgroundsStoryGlobals: false, // Desativa o uso de 'globals' para os backgrounds (compatibilidade com versões anteriores)
  },
};
export default config; // Exporta o objeto config como padrão (obrigatório para o Storybook)
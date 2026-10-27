import { getFullEnv } from '@/env/config'; // Importa a função que pega as configurações do ambiente atual

/**
 * Aguarda um pequeno delay artificial, **somente em ambientes de desenvolvimento ou teste**.
 *
 * Útil para simular latência e visualizar estados de transição da UI (ex: botão "Carregando...").
 * Não afeta ambientes como `production` ou `preview`, evitando delays indesejados em produção.
 *
 * @param delay - Tempo de espera em milissegundos (default: 1000ms)
 *
 * @example
 * await devOnlyDelay(500); // só espera se estiver em 'e2e', 'test' ou 'development'
 */

export async function devOnlyDelay(delay: number = 1000): Promise<void> { // Crio uma função de delay, que promete não retornar nada (void) e recebe um delay (padrão 1000ms)
  
  const { currentEnv } = getFullEnv(); // Pega o ambiente atual (development, test, e2e, etc) do arquivo de configuração

  const envsToDelay = ['e2e']; // Lista de ambientes onde o delay é permitido (apenas 'e2e' para não travar testes unitários/integração)

  const shouldDelay = delay > 0 && envsToDelay.includes(currentEnv); // Só vou pausar se o tempo for maior que 0 E se o ambiente atual estiver na lista permitida

  if (shouldDelay) { // Se for para pausar
    return new Promise(resolve => setTimeout(resolve, delay)); // Retorno uma Promise que só vai ser resolvida (destravada) após o tempo do setTimeout
  }
}
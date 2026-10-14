import { Todo } from '@/core/todo/schemas/todo.contract'; // Importa o tipo Todo (define a estrutura de uma tarefa)

// Crio tarefas manuais para simular (mock) nos testes/stories
export const mockTodos: Todo[] = [ // Array de tarefas simuladas (cada uma segue o tipo Todo)
  {
    id: '1746472743268', // ID único da tarefa
    description: 'Fazer café', // Descrição da tarefa
    createdAt: '2025-05-04T20:11:13.279Z', // Data de criação (formato ISO)
  },
  {
    id: '1746472935131', // ID único da tarefa
    description: 'Estudar para a prova', // Descrição da tarefa
    createdAt: '2025-05-05T17:28:01.564Z', // Data de criação (formato ISO)
  },
  {
    id: '1746472957750', // ID único da tarefa
    description: 'Ler O Senhor Dos Anéis', // Descrição da tarefa
    createdAt: '2025-05-01T15:51:46.876Z', // Data de criação (formato ISO)
  },
];
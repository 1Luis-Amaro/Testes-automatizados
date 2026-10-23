'use client';
import { DeleteTodoAction } from '@/core/todo/actions/todo.action.type'; // Importa o tipo da action de deletar
import { Todo } from '@/core/todo/schemas/todo.contract'; // Importa o tipo Todo
import { sanitizeStr } from '@/utils/sanitize-str'; // Importa a função que limpa strings
import clsx from 'clsx'; // Importa o clsx para combinar classes CSS condicionalmente
import { CircleXIcon } from 'lucide-react'; // Importa o ícone de X
import { useId, useTransition } from 'react'; // Importa hooks do React

export type TodoListProps = {
  // Cria um type para as props do componente TodoList
  todos?: Todo[]; // todos: array de tarefas (opcional)
  action: DeleteTodoAction; // action: a Server Action que deleta uma tarefa
};

export function TodoList({ action, todos = [] }: TodoListProps) {
  // Função do componente TodoList, com props no parâmetro
  const id = useId(); // Gero um id único com esse hook (evita conflitos de IDs)
  const headingId = `heading-${id}`; // Crio o ID do heading baseado no ID gerado
  const [pending, startTransition] = useTransition(); // Hook que gerencia transições (pending = true enquanto a action roda)

  function handleTodoDelete(id: string) {
    // Função que deleta um TODO (chamada em cada botão de excluir)
    const cleanId = sanitizeStr(id); // Limpo o ID com a função sanitizeStr
    if (!cleanId) return; // Se o ID não for válido após a limpeza, retorno (não faz nada)

    startTransition(async () => {
      // Inicio a transição (marca a atualização como não urgente)
      const result = await action(cleanId); // Chamo a Server Action passando o ID limpo

      if (!result.success) {
        // Se a ação NÃO foi bem-sucedida
        alert(result.errors[0]); // Mostro um alert do navegador com a mensagem de erro
      }
    });
  }
  return (
    // Retorno o HTML do JSX
    <div>
      {' '}
      {/* Container principal */}
      <h1 // Título da lista de tarefas
        className='mb-8 text-3xl/normal font-extrabold text-center' // Classes CSS do título
        id={headingId} // ID do título (usado para acessibilidade)
      >
        Lista de tarefas
      </h1>
      <TodoListItems // Componente que renderiza a lista de tarefas
        handleTodoDelete={handleTodoDelete} // Passa a função de deletar
        headingId={headingId} // Passa o ID do título
        pending={pending} // Passa o estado de transição
        todos={todos} // Passa o array de tarefas
      />
    </div>
  );
}

type TodoListItemsProps = {
  // Cria um type para as props do componente TodoListItems
  todos?: Todo[]; // todos: array de tarefas (opcional)
  pending?: boolean; // pending: estado de carregamento (opcional)
  headingId: string; // headingId: ID do título (obrigatório)
  handleTodoDelete: (id: string) => void; // handleTodoDelete: função que deleta (obrigatória)
};

function TodoListItems({
  // Componente separado para manter o código organizado
  todos,
  pending,
  headingId,
  handleTodoDelete,
}: TodoListItemsProps) {
  // Todas as props são do type TodoListItemsProps
  const hasTodos = Array.isArray(todos) && todos.length > 0; // Verifico se é um array e se tem pelo menos 1 item

  if (!hasTodos) return null; // Se não tiver tarefas, retorno null (não renderiza a lista na tela)

  const todoItemClasses = clsx(
    // Crio as classes CSS condicionalmente para cada item da lista
    !pending && 'bg-amber-200 text-amber-900 hover:scale-105', // Classes quando NÃO está pendente (normal)
    pending && 'bg-gray-200 text-gray-900 hover:scale-100', // Classes quando está pendente (processando)
    'transition flex justify-between py-2 px-4 rounded-lg', // Classes padrão (flex para alinhar, padding, bordas)
  );

  return (
    // Retorno a lista (ul)
    <ul className='mb-6 flex flex-col gap-2' aria-labelledby={headingId}>
      {' '}
      {/* Lista com ID de acessibilidade apontando para o heading */}
      {todos.map(todo => {
        // Percorro cada tarefa
        return (
          // Para cada tarefa, retorno:
          <li className={todoItemClasses} key={todo.id}>
            <span>{todo.description}</span>
            <button // Botão de deletar
              className={clsx(
                // Combina as classes CSS condicionalmente
                'cursor-pointer disabled:cursor-not-allowed',
                'disabled:text-gray-500 hover:text-black',
              )}
              aria-label={`Apagar: ${todo.description}`} // Rótulo para acessibilidade (leitores de tela)
              onClick={() => handleTodoDelete(todo.id)} // Ao clicar, chama a função de deletar com o ID
              disabled={pending} // Desabilita o botão enquanto a action está rodando
            >
              <CircleXIcon size={18} />
            </button>
          </li>
        );
      })}
    </ul>
  );
}

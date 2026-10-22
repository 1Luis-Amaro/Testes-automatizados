'use client'
import { DeleteTodoAction } from '@/core/todo/actions/todo.action.type'; // Importa o tipo da action de deletar
import { Todo } from '@/core/todo/schemas/todo.contract'; // Importa o tipo Todo
import { sanitizeStr } from '@/utils/sanitize-str'; // Importa a função que limpa strings
import clsx from 'clsx'; // Importa o clsx para combinar classes CSS condicionalmente
import { CircleXIcon } from 'lucide-react'; // Importa o ícone de X
import { useId, useTransition } from 'react'; // Importa hooks do React

export type TodoListProps = { // Cria um type para as props do componente
  todos?: Todo[]; // todos: array de tarefas (opcional)
  action: DeleteTodoAction; // action: a Server Action que deleta uma tarefa
};

export function TodoList({ action, todos = [] }: TodoListProps) { // Função do componente TodoList, com props no parametro
  const id = useId(); //gero um id unico dessa forma evito conflitos de IDs
  const headingId = `heading-${id}`; // Cria o ID do heading baseado no ID gerado (para acessibilidade)
  const [pending, startTransition] = useTransition(); // Hook que gerencia transições (pending = true enquanto a action roda)


  function handleTodoDelete(id: string) { // Função que deleta um TODO (chamada em cada botão de excluir)
    const cleanId = sanitizeStr(id); // Limpa o ID com a função sanitizeStr
    if (!cleanId) return; // Se o ID não for válido após a limpeza, retorna (não faz nada) e não chamo a action 

    startTransition(async () => { // Inicia a transição (marca a atualização como não urgente)
      const result = await action(cleanId); // Chama a Server Action passando o ID limpo

      if (!result.success) { // Se a ação NÃO foi bem-sucedida
        alert(result.errors[0]); //vai dar um alert do navegador lá pro usuário
      }
    });
  }
  return ( //agora para o HTML do JSX
    <div> {/**vou ter esse Container principal */}
      <h1 //Titulo da lista de tarefas
        className='mb-8 text-3xl/normal font-extrabold text-center' // Classes CSS do título
        id={headingId} //ID do titulo (usadi para acessibilidade)
      >
        Lista de tarefas
      </h1>

      <TodoListItems // Componente que renderiza a lista de tarefas
        handleTodoDelete={handleTodoDelete} // Passa a função de deletar
        headingId={headingId}  // Passa o ID do título
        pending={pending} // Passa o estado de transição
        todos={todos} // Passa o array de tarefas
      />
    </div>
  );
}

type TodoListItemsProps = { // Cria um type para as props do componente TodoListItems
  todos?: Todo[]; //todos: array de tarefas (opcional) 
  pending?: boolean; // o pendig (não é obrigatorio)
  headingId: string; // o headingId: ID do título  (obrigatório)
  handleTodoDelete: (id: string) => void; //  e a função handleTodoDelete que eu vou colocar em cada botão
};

function TodoListItems({ //criei esse componente para manter o código organizado
  todos,  
  pending,  
  headingId, 
  handleTodoDelete, 
}: TodoListItemsProps) {// Todas as props são do type TodoListItemsProps
  const hasTodos = Array.isArray(todos) && todos.length > 0; //aqui vou checar se os todos é um array e se é maior que zero se tem algum elemento nesse array

  if (!hasTodos) return null; //se nao tiver nenhuma tarefa eu retorno null então não exibo a lista na tela, somente o titulo

  const todoItemClasses = clsx( //agora se tiver vou criar classes para cada um dos li da ul 
    !pending && 'bg-amber-200 text-amber-900 hover:scale-105', // Classes quando NÃO está pendente (normal)
    pending && 'bg-gray-200 text-gray-900 hover:scale-100', // Classes quando está pendente (processando)
    'transition flex justify-between py-2 px-4 rounded-lg', // Classes padrão do items
  );

  return ( //agora vou retornar a lista (ul)
    <ul className='mb-6 flex flex-col gap-2' aria-labelledby={headingId}> {/**passo o css para minha ul e também Lista com ID de acessibilidade */}
      {todos.map(todo => { // Percorre cada tarefa
        return ( //e para cada tarefa vou retornar 
          <li className={todoItemClasses} key={todo.id}> {/**Item da lista com cada classe personalizada que criei e com o um id unico  */}
            <span>{todo.description}</span> {/* Descrição da tarefa */}

            <button // Botão de deletar
              className={clsx( /// Combina as classes CSS condicionalmente
                'cursor-pointer disabled:cursor-not-allowed',
                'disabled:text-gray-500 hover:text-black',
              )}
              aria-label={`Apagar: ${todo.description}`} //com um area label que sreve pra explicar o que ele faze e que pega também a descrição da tarefa
              onClick={() => handleTodoDelete(todo.id)} //e com um evento de click que todas vez que é clicado vai disparar minha função de deleção a partir do id do meu todo 
              disabled={pending} // Desabilita o botão enquanto a action está rodando
            >
              <CircleXIcon size={18} /> {/**e passo esse icone para o meu botao */}
            </button>
          </li>
        );
      })}
    </ul>
  );
}
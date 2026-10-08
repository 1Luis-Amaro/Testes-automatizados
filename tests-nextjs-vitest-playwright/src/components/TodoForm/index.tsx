'use client'; // Avisa ao Next.js que este componente roda no cliente (navegador)

import { CreateTodoAction } from '@/core/todo/actions/todo.action.type'; // Importa o tipo da ação de criar tarefa
import { sanitizeStr } from '@/utils/sanitize-str'; // Importa a função que limpa strings
import { useRef, useState, useTransition } from 'react'; // Importa hooks do React
import { InputText } from '../InputText'; // Importa o componente de input
import { Button } from '../Button'; // Importa o componente de botão
import { CirclePlusIcon } from 'lucide-react'; // Importa o ícone de adicionar

export type TodoFormProps = {
  // Cria um type para as props do formulário
  action: CreateTodoAction; // A prop 'action' é do tipo CreateTodoAction (a Server Action que cria a tarefa)
};

export function TodoForm({ action }: TodoFormProps)  {// Função do componente TodoForm
  const [pending, startTransition] = useTransition(); // Hook que gerencia transições (pending = true enquanto a action roda)
  const [inputError, setInputError] = useState(''); // Estado para a mensagem de erro (inicia vazio)
  const ref = useRef<HTMLInputElement>(null); // Referência para o elemento <input> (para acessar o valor diretamente)

  function handleCreateTodo(e: React.FormEvent<HTMLFormElement>) {
    // Função que lida com o envio do formulário
    e.preventDefault(); //evito que quando eu enviar o formulário a página seja recarregada ou enviada ao servidor

    const input = ref.current; //pegando o input que vai ficar na referencia, na chave curret do ref

    if (!input) return; // Se não capturar o input, retorna (não faz nada)

    const description = sanitizeStr(input.value); //se passo do if quer dizer que pegou um input, após isso vou usar minha função de limpeza para ajustar o valor que veio

    startTransition(async () => { // Inicia a transição (marca a atualização como não urgente)
      const result = await action(description); // Chama a Server Action com a descrição limpa e guarda o resultado

      if (!result.success) {// Se a ação NÃO foi bem-sucedida (success = false)
        setInputError(result.errors[0]); // Define a mensagem de erro com o primeiro erro do array
        return // Retorna (não continua)
      }

      input.value = ''; //limpando input (após a criação bem-sucedida)
      setInputError(''); //caso ficou algum erro faço essa limpeza também (após a criação bem-sucedida)
    });
  }

  return (
    <form onSubmit={handleCreateTodo} className='flex flex-col flex-1 gap-6'> {/* Formulário que chama handleCreateTodo ao enviar */}
      {/**retorno do meu HTML JSX  */}
           <InputText // Componente de input
        name='description' // Nome do campo
        labelText="Tarefa" // Rótulo do campo
        placeholder="Digite sua tarefa" // Placeholder do campo
        disabled={pending} // Desabilita o input enquanto a action está rodando
        errorMessage={inputError} // Mensagem de erro (se houver)
        ref={ref} // Referência para acessar o valor do input
      />
      <Button type='submit' disabled={pending}> {/* Botão de envio, desabilitado enquanto a action está rodando */}
        
        <CirclePlusIcon />
        {!pending && <span>Criar tarefa</span>}{/* Se NÃO estiver pendente, mostra "Criar tarefa" */}
        {pending && <span>Criando tarefa...</span>} {/**agora se tiver penente eu coloco o button como pendente então ele fica desabilitado isso porque a tarefa está sendo criada */}
       
      </Button>
    </form>
  )
}


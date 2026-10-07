'use client'

import { CreateTodoAction } from "@/core/todo/actions/todo.action.type"
import { sanitizeStr } from "@/utils/sanitize-str"
import { useRef, useState, useTransition } from "react"
import { InputText } from "../InputText"
import { Button } from "../Button"
import { CirclePlusIcon } from "lucide-react"

export type TodoFormProps = {
    action: CreateTodoAction
}

export function TodoForm({action} : TodoFormProps) {
    const [pending, startTransition] = useTransition()
    const [inputError, setInputError] = useState('')
    const  ref = useRef<HTMLInputElement>(null)

    function handleCreateTodo(e:React.FormEvent<HTMLFormElement>){
        e.preventDefault() //evito que quando eu enviar o formulário a página seja recarregada ou enviada ao servidor

        const input = ref.current //pegando o input que vai ficar na referencia, na chave curret do ref 

        if(!input) return //se não capturar um input retorno 

        const description = sanitizeStr(input.value) //se passo do if quer dizer que pegou um input, após isso vou usar minha função de limpeza para ajustar o valor que veio 

        startTransition(async () => {
            const result  = await action(description) //guardo a descrição da minha action em result

            if(!result.success) {//se não deu certo guardar a descrição da minha action
                setInputError(result.errors[0]) //coloco no meu input de error o erro do indice 0 e exibo para o usuário
                return //coloco um return caso não passe daqui 
            }

            input.value = '' //limpando input
            setInputError ('') //caso ficou algum erro faço essa limpeza também 
        })
    }

    return (
        <form onSubmit={handleCreateTodo} className='flex flex-col flex-1 gap-6'>
            <InputText
                name='description'
                labelText="Tarefa"
                placeholder="Digite sua tarefa"
                disabled={pending}
                errorMessage={inputError}
                ref={ref}
            />
            <Button type="submit" disabled={pending} >
                <CirclePlusIcon/>
                {!pending && <span>Criar tarefa</span>} {/**se não tiver pendente eu estou livre para criar uma tarefa */}
                {pending && <span>Criando tarefa...</span>} {/**agora se tiver penente eu coloco o button como pendente então ele fica desabilitado isso porque a tarefa está sendo criada */}

            </Button>
        </form>
    )

}
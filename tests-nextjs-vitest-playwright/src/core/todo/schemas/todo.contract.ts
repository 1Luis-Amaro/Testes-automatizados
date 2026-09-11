export type Todo = {
    id: string,
    description: string,
    createdAt: string
}

export type InvalidTodo = { //crio esse tipo para criar regras e manter a estrutura do meu código integro (caso de erro)
    success: false;
    errors: string[]
}

export type ValidTodo = { //crio esse tipo para criar regras e manter a estrutura do meu código integro (caso de sucesso)
    success: true;
    todo: Todo
}

export type TodoPresenter = ValidTodo | InvalidTodo // União dos dois tipos (pode ser sucesso ou erro)
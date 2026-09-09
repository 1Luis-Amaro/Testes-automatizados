type ValidateTodoDescription = { //regra criada para manter um padrão no código 
    errors: string[]; //tem que ter um array de erros em string 
    success: boolean // um success que é alternativo então pode ser true ou false
}
export function validateTodoDescription(description: string): ValidateTodoDescription { //função que vai validar a descrição, passo o tipo que criei para manter a regra na função 
    const errors = []; // Inicializo o array de erros vazio

    if(description.length <= 3){ //se a descrição que foi passada (a descrição está no parametro da função) o tamanho dela for menor que 3 
        errors.push('Descrição precisa ter mais de 3 caracteres') // envio um erro com a descrição passada 
    }

    return { //agora se passar por esse if 
        success: errors.length === 0, // Se o array de erros estiver vazio (length === 0), a validação passou (true); se tiver erros, falhou (false) 
        errors,// Array de erros (vazio se passou, com mensagens se falhou) 
    }

}
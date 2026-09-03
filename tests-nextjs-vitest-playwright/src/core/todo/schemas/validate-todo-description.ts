type ValidateTodoDescription = {
    errors: string[];
    success: boolean
}
export function validateTodoDescription(description: string): ValidateTodoDescription {
    const errors = [];

    if(description.length <= 3){
        errors.push('Descrição precisa ter mais de 3 caracteres')
    }

    return {
        success: errors.length === 0,
        errors,
    }

}
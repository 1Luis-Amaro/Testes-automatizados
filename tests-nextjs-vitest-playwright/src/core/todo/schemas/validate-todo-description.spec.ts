import { validateTodoDescription } from "./validate-todo-description"

describe('validateTodoDesciption, (unit)', () => {
    test('deve retornar erros quando a descrição estiver menos que 4 caracteres', () => {
        const description = 'abc';
        const result = validateTodoDescription(description)
        expect(result.errors).toStrictEqual([
            'Descrição precisa ter mais de 3 caracteres'
        ])
        expect(result.success).toBe(false)
    })
    test('deve retornar sucesso quando a descrição estiver maior que 3 caracteres', () => {
        const description = 'abcd';
        const result = validateTodoDescription(description)
        expect(result.errors).toStrictEqual([])
        expect(result.success).toBe(true)
    })
})
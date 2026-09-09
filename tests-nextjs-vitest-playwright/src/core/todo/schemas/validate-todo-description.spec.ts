import { validateTodoDescription } from "./validate-todo-description"

describe('validateTodoDesciption, (unit)', () => {// Bloco de testes unitários para a função validateTodoDescription
    test('deve retornar erros quando a descrição estiver menos que 4 caracteres', () => { // O que meu teste deve fazer: verificar se retorna erro quando a descrição é muito curta
        const description = 'abc'; // Passando a descrição que vou testar (3 caracteres, inválida)
        const result = validateTodoDescription(description) //pego a função que faz a validação e passo para ela a descrição que defini para realizar o teste
        expect(result.errors).toStrictEqual([ // Espero que o array de erros contenha exatamente esta mensagem
            'Descrição precisa ter mais de 3 caracteres'
        ])
        expect(result.success).toBe(false) // Espero que o success seja false (validação falhou)
    })
    test('deve retornar sucesso quando a descrição estiver maior que 3 caracteres', () => { // O que meu teste deve fazer: verificar se retorna sucesso quando a descrição é válida
        const description = 'abcd'; //passando a descrição que vou testar 
        const result = validateTodoDescription(description) //pego a função que faz a validação e passo para ela a descrição que defini para realizar o teste
        expect(result.errors).toStrictEqual([]) //espero que quando a descrição estiver ok, o array de erros esteja exatamente com o array vazio 
        expect(result.success).toBe(true) //espero que quando a descrição estiver ok, o success esteja examente com o valor true 
    })
})
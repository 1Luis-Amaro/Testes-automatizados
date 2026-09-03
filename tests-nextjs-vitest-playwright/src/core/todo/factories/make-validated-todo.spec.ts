import * as sanitizeStrMod from "@/utils/sanitize-str"

describe('makeValidatedTodo (unit)', () => {
    test('deve chamar a função sanitizeStr com o valor correto', () => {
        //Arrange 
        const description = 'abcd'
        const sanitizeStrSpy = vi.spyOn(sanitizeStrMod, 'sanitizeStr')
    })

    test('deve chamar a validatedDescription com o retorno do sanitizeStr', () => {})

    test('deve chamar makeNewTodo se validatedDescription retornou sucesso', () => {})

    test('deve retornar a validatedDescription.error se a validação falhou', () => {})
    
})


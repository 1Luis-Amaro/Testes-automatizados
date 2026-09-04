import * as sanitizeStrMod from "@/utils/sanitize-str" //estou pegando todo o module de limpeza de caracteres 
import { makeValidetedTodo } from "./make-validated-todo" // Importa a função que valida e cria uma nova tarefa

describe('makeValidatedTodo (unit)', () => { 
    test('deve chamar a função sanitizeStr com o valor correto', () => {
        //Arrange  (Preparação)
        const description = 'abcd' //// Descrição que será passada para a função de limpeza
        const sanitizeStrSpy = vi //chamo o vitest para pegar suas funções
        .spyOn(sanitizeStrMod, 'sanitizeStr') // Crio um "espião" (spy) para monitorar a função sanitizeStr (ver se foi chamada, quantas vezes, com quais argumentos)
        .mockReturnValue(description)  // Em vez de executar a função real, eu "mocko" (simulo) ela: defino que, quando sanitizeStr for chamada, ela vai retornar o valor que eu coloquei aqui (description), sem executar a lógica original
        
        //Act (Ação) 
        makeValidetedTodo(description)// Chamo a função que valida a tarefa

        // Assert 
        expect(sanitizeStrSpy).toHaveBeenCalledExactlyOnceWith(description) // Verifico se a função sanitizeStr foi chamada EXATAMENTE 1 VEZ e com a descrição correta
        expect(sanitizeStrSpy).toHaveBeenCalledTimes(1) // Verifico se a função sanitizeStr foi chamada 1 vez (redundante, mas seguro)
        expect(sanitizeStrSpy).toHaveBeenCalledWith(description) // Verifico se a função sanitizeStr foi chamada com a descrição correta


    })

    test('deve chamar a validatedDescription com o retorno do sanitizeStr', () => {})

    test('deve chamar makeNewTodo se validatedDescription retornou sucesso', () => {})

    test('deve retornar a validatedDescription.error se a validação falhou', () => {})
    
})


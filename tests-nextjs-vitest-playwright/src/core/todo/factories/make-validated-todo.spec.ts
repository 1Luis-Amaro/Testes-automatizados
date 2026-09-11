import * as sanitizeStrMod from "@/utils/sanitize-str" //estou pegando todo o module de limpeza de caracteres 
import { makeValidetedTodo } from "./make-validated-todo" // Importo os tipos de tarefa válida e inválida, e a função que faz a validação completa
import * as validateTodoDescriptionMod from "../schemas/validate-todo-description" // Importo o módulo que valida a descrição da tarefa (mínimo de 3 caracteres)
import * as makeMocksTodoMod from "./make-new-todo" // Importo o módulo que cria uma nova tarefa (com id, descrição e data)
import { InvalidTodo, ValidTodo } from "../schemas/todo.contract"

describe('makeValidatedTodo (unit)', () => {  // Bloco de testes unitários para a função makeValidatedTodo
    test('deve chamar a função sanitizeStr com o valor correto', () => { /// O que o teste deve fazer: verificar se sanitizeStr foi chamada
        //Arrange  (Preparação)
        const { description, sanitizeStrSpy } = makeMocks() // Pego a descrição da tarefa e o espião da função sanitizeStr do meu mock

        //Act (Ação) 
        makeValidetedTodo(description)// Chamo a função que valida a tarefa 

        // Assert (Verificação)
        expect(sanitizeStrSpy).toHaveBeenCalledExactlyOnceWith(description) // Verifico se a função sanitizeStr foi chamada EXATAMENTE 1 VEZ e com a descrição correta



    })

    test('deve chamar a validatedDescription com o retorno do sanitizeStr', () => { // o que o teste tem que fazer, verificar se validateTodoDescription recebe o retorno de sanitizeStr
        const { description, sanitizeStrSpy, validaTodoDescriptionSpy } = makeMocks() // Pego a descrição, o espião de sanitizeStr e o espião de validateTodoDescription
        const sanitizeStrReturn = "retorno de sanitizeStr" //Variável que será o retorno simulado da sanitizeStr esse seria o valor limpo após a função rodar 

        //Mocko o retorno de sanitizeStr
        sanitizeStrSpy.mockReturnValue(sanitizeStrReturn) // Quando sanitizeStr for chamada, ela vai retornar "retorno de sanitizeStr" que seria a descrição limpa 

        makeValidetedTodo(description) as ValidTodo // Chamo a função que valida a tarefa e como nesse caso deu tudo certo coloco o tipo valido nela

        // Assert (Verificação) 
        expect(validaTodoDescriptionSpy).toHaveBeenCalledExactlyOnceWith(sanitizeStrReturn)// Verifico se validateTodoDescription foi chamada EXATAMENTE 1 VEZ e com o MESMO VALOR que sanitizeStr retornou (garantindo que o valor foi repassado corretamente, independente do conteúdo)
        // expect(result).toStrictEqual({ //checando o objeto todo
        //     data: {
        //         id: 'any-id',
        //         description: 'abcd',
        //         createdAt: '2026-09-08T19:17:30.668Z'
        //     }
        // })
        // expect(result.success).toBe(true) //checando só um trecho de um objeto se tem determinada coisa
        // expect(result.data).toStrictEqual(
        //     ({
        //         id: 'any-id',
        //         description: 'abcd',
        //         createdAt: expect.any(String)
        //     })
        // )


    })

    test('deve chamar makeNewTodo se validatedDescription retornou sucesso', () => { // o que meu teste deve fazer, verificar se makeNewTodo é chamada quando a validação passa
        const { description } = makeMocks() // pego a descrição que estou simulando 
        const result = makeValidetedTodo(description) as ValidTodo // Chamo a função de validação e forço o tipo como ValidTodo (porque sei que vai dar certo) 

        expect(result.success).toBe(true) // Verifico se o success é true (deu tudo certo)

        expect(result.todo.id).toBe('any-id')  // Verifico se o id da tarefa é 'any-id' (valor definido no mock)
        expect(result.todo.description).toBe('abcd'); // Verifico se a descrição da tarefa é 'abcd' (valor definido no mock)
        expect(result.todo.createdAt).toBe('any-date'); // Verifico se a data de criação é 'any-date' (valor definido no mock)
    });

    test('deve retornar a validatedDescription.error se a validação falhou', () => {// o que meu teste deve fazer, verificar se retorna os erros quando a validação falha
        const { errors, description, validaTodoDescriptionSpy } = makeMocks() // Pego os erros, a descrição e o espião de validateTodoDescription
        validaTodoDescriptionSpy.mockReturnValue({ // Modifico o retorno do espião para simular uma falha na validação
            errors, // Retorno os erros que defini no mock
            success: false // Retorno success como false (validação falhou)
        })

        const result = makeValidetedTodo(description) as InvalidTodo // Chamo a função de validação e forço o tipo como InvalidTodo (porque sei que vai falhar)

        expect(result).toStrictEqual({ // Verifico se o resultado é exatamente o objeto esperado
            errors, // Deve ter os erros que defini
            success: false // Deve ter success como false
        })
    })

})


const makeMocks = (description = 'abcd') => { // Função auxiliar que cria todos os mocks para os testes

    const errors = ['any', 'error'] //// Array de erros simulados (usado quando a validação falha)

    const todo = { // Objeto de tarefa simulado (usado quando a validação passa)
        id: 'any-id', // ID simulado
        description, // Descrição recebida como parâmetro (padrão 'abcd')
        createdAt: 'any-date' // Data de criação simulada
    }

    const sanitizeStrSpy = vi /// Chamo o Vitest para criar um espião
        .spyOn(sanitizeStrMod, 'sanitizeStr') // Crio um "espião" (spy) para monitorar a função sanitizeStr (ver se foi chamada, quantas vezes, com quais argumentos)
        .mockReturnValue(description)  // Em vez de executar a função real, eu "mocko" (simulo) ela: defino que, quando sanitizeStr for chamada, ela vai retornar o valor que eu coloquei aqui (description), sem executar a lógica original

    const validaTodoDescriptionSpy = vi. /// Chamo o Vitest para criar um espião
        spyOn(validateTodoDescriptionMod, 'validateTodoDescription') // Crio um "espião" (spy) para monitorar a função validateTodoDescription (ver se foi chamada, quantas vezes, com quais argumentos)
        .mockReturnValue({ // Em vez de executar a função real, eu "mocko" (simulo) ela: defino que, quando validateTodoDescription for chamada, retorna sucesso por padrão
            errors: [], //deixo o errors como vazio ja que deu tudo certo
            success: true, //e success como true já que deu tudo certo
        })

    const makeMocksTodoSpy = vi. /// Chamo o Vitest para criar um espião
        spyOn(makeMocksTodoMod, 'makeNewTodo') // Crio um "espião" (spy) para monitorar a função makeNewTodo (ver se foi chamada, quantas vezes, com quais argumentos)
        .mockReturnValue(todo) //// Em vez de executar a função real, eu "mocko" (simulo) ela: defino que quando makeNewTodo for chamada, retorna a tarefa simulada 

    return { //por fim vou retornar todas as funções e variveis que criei dentro dessa minha mock
        todo, // Tarefa simulada
        description, // Descrição simulada
        validaTodoDescriptionSpy, // Espião de validateTodoDescription
        sanitizeStrSpy, // Espião de sanitizeStr
        makeMocksTodoSpy, // Espião de makeNewTodo
        errors // Erros simulados
    }

}
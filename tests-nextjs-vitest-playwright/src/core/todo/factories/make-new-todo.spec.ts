import { makeNewTodo } from "./make-new-todo"

describe('makeNewTodo (unit)', ()=> {
test('Deve retornar um novo todo válido', () => {
    //AAA -> Arrange, Act , Assert  - esse é o modelo que vou usar para fazer meus testes

    //Arrange -> criar as coisas que eu preciso 
    const expectedTodo = {
        id: expect.any(String),
        description: 'meu novo Todo',
        createdAt: expect.any(String)
    }

    //Act -> ação que meu teste tem que fazer
    const newTodo = makeNewTodo('meu novo Todo')

    //Assert
    //toBe estou checando meus valores primitivos 
    //toEqual e o toStrictEqual são para checagens de objetos, para ver se todas as chaves batem

    //nesse caso aqui eu esotu checando somente a descrição
    expect(newTodo.description).toBe(expectedTodo.description)

    //já aqui vou checar o objeto inteiro 
    expect(newTodo).toStrictEqual(expectedTodo)

})

})

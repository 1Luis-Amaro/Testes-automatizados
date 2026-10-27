import { makeTestTodoRepository } from '@/core/__tests__/utils/make-test-todo-repository' // Importa a função que cria o repositório de testes
import { test, expect, Page } from '@playwright/test' // Importa as funções do Playwright

const HOME_URL = '/' // URL da página inicial
const HEADING = 'Lista de tarefas' // Texto do cabeçalho
const INPUT = 'Tarefa' // Label do input
const BUTTON = 'Criar tarefa' // Texto do botão normal
const BUTTON_BUSY = 'Criando tarefa...'; // Texto do botão quando está carregando (corrigido!)
const NEW_TODO_TEXT = 'New Todo' // Texto da tarefa que será criada

//helpers
const getHeading = (p: Page) => p.getByRole('heading', { name: HEADING }) // Função que busca o elemento de título
const getInput = (p: Page) => p.getByRole('textbox', { name: INPUT }) // Função que busca o input de texto
const getBtn = (p: Page) => p.getByRole('button', { name: BUTTON }) // Função que busca o botão normal
const getBtnBusy = (p: Page) => p.getByRole('button', { name: BUTTON_BUSY }) // Função que busca o botão de carregamento

const getAll = (p: Page) => ({ // Função que retorna todos os elementos de uma vez
    heading: getHeading(p),
    input: getInput(p),
    btn: getBtn(p),
    btnBusy: getBtnBusy(p)
})

test.beforeEach(async ({ page }) => { // Antes de CADA teste, quero fazer o seguinte:
    const { deleteTodoNoWhere } = await makeTestTodoRepository() // Pego a função de deletar todos os todos do banco
    await deleteTodoNoWhere() // Limpo o banco de dados para o teste começar do zero

    await page.goto(HOME_URL) // Navego até a página inicial
})

test.afterAll(async ({ }) => { // Depois de TODOS os testes, quero fazer o seguinte:
    const { deleteTodoNoWhere } = await makeTestTodoRepository() // Pego a função de deletar todos os todos do banco
    await deleteTodoNoWhere() // Limpo o banco de dados após terminar
})

test.describe('<Home /> (E2E)', () => { // Descrição do bloco de testes E2E da Home
    // Renderização 
    test.describe('Renderização', () => { // Sub-descrição: testes de renderização
        test('deve ter o title html correto', async ({ page }) => { // O que o teste verifica: se a aba do navegador tem o título correto
            await expect(page).toHaveTitle('Testes com Vitest e Playwright') // Espero que o título da página seja esse
        })

        test('deve renderizar o cabeçalho, o input e o botão para criar TODOs', async ({ page }) => { // O que o teste verifica: se os elementos essenciais aparecem na tela
            await expect(getHeading(page)).toBeVisible() // Espero que o cabeçalho esteja visível
            await expect(getInput(page)).toBeVisible() // Espero que o input esteja visível
            await expect(getBtn(page)).toBeVisible() // Espero que o botão esteja visível
        })
    })
    
    test.describe('Criação', () => { // Sub-descrição: testes de criação de tarefas
        test('deve permitir criar um TODO', async ({ page }) => { // O que o teste verifica: se consigo criar uma tarefa
            const { btn, input } = getAll(page) // Pego os elementos da página

            await input.fill(NEW_TODO_TEXT) // Digito o texto no input
            await btn.click() // Clico no botão de criar

            const createdTodo = page
                .getByRole('listitem') // Pego o item da lista
                .filter({ hasText: NEW_TODO_TEXT }) // Filtro pelo texto da tarefa que acabei de criar
            await expect(createdTodo).toBeVisible() // Espero que a tarefa criada esteja visível na tela
        })
        
        test('deve fazer o trim da descrição do input ao criar o TODO', async ({ page }) => { // O que o teste verifica: se os espaços em branco são removidos
            const { btn, input } = getAll(page); // Pego os elementos da página

            const textToBeTrimmed = '   no spaces here   '; // Texto com espaços antes e depois
            const textTrimmed = textToBeTrimmed.trim(); // Texto sem os espaços (simulando o que o frontend deve fazer)

            await input.fill(textToBeTrimmed); // Digito o texto com espaços
            await btn.click(); // Clico para criar

            const createdTodo = page
                .getByRole('listitem') // Pego o item da lista
                .filter({ hasText: textTrimmed }); // Filtro pelo texto já sem espaços
            const createdTodoText = await createdTodo.textContent(); // Pego o texto exato do item criado

            await expect(createdTodoText).toBe(textTrimmed); // Espero que o texto na tela seja igual ao texto sem espaços
        });
        
        test('deve permitir que eu crie mais de um TODO', async ({ page }) => { // O que o teste verifica: se consigo criar várias tarefas seguidas
            const { btn, input } = getAll(page) // Pego os elementos da página
            const todo1 = 'Todo 1' // Primeira tarefa
            const todo2 = 'Todo 2' // Segunda tarefa

            await input.fill(todo1) // Digito a primeira tarefa
            await btn.click() // Clico para criar

            const todo1Item = page.getByRole('listitem').filter({ hasText: todo1 }) // Busco o primeiro item criado
            await expect(todo1Item).toBeVisible() // Espero que ele esteja visível

            await input.fill(todo2) // Digito a segunda tarefa
            await btn.click() // Clico para criar

            const todo2Item = page.getByRole('listitem').filter({ hasText: todo2 }) // Busco o segundo item criado
            await expect(todo2Item).toBeVisible() // Espero que ele esteja visível
        })
        
        test('deve desativar o botão enquanto cria o TODO', async ({ page }) => { // O que o teste verifica: se o botão fica bloqueado durante a criação
            const { btn, input } = getAll(page) // Pego os elementos da página

            await input.fill(NEW_TODO_TEXT) // Digito o texto no input
            await btn.click() // Clico no botão

            await expect(getBtnBusy(page)).toBeVisible(); // Espero que o botão com texto "Criando..." apareça
            await expect(getBtnBusy(page)).toBeDisabled(); // Espero que esse botão esteja desabilitado

            const createdTodo = page
                .getByRole('listitem') // Pego o item da lista
                .filter({ hasText: NEW_TODO_TEXT }); // Filtro pelo texto da tarefa criada
            await expect(createdTodo).toBeVisible(); // Espero que a tarefa seja criada e apareça

            await expect(btn).toBeVisible(); // Espero que o botão normal volte a aparecer
            await expect(btn).toBeEnabled(); // E que ele esteja habilitado novamente
        })
        
        test('deve desativar o input enquanto cria o TODO', async ({ page }) => { // O que o teste verifica: se o input fica bloqueado durante a criação
            const { btn, input } = getAll(page) // Pego os elementos da página

            await input.fill(NEW_TODO_TEXT) // Digito o texto
            await btn.click() // Clico para criar

            await expect(input).toBeDisabled(); // Espero que o input fique desabilitado (impedindo digitar mais)

            const createdTodo = page
                .getByRole('listitem') // Pego o item da lista
                .filter({ hasText: NEW_TODO_TEXT }); // Filtro pelo texto da tarefa
            await expect(createdTodo).toBeVisible(); // Espero que a tarefa apareça na tela

            await expect(input).toBeEnabled(); // Espero que o input seja habilitado novamente após a criação
        })
    })
})
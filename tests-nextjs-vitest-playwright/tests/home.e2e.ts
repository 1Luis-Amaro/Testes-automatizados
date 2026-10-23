import { makeTestTodoRepository } from '@/core/__tests__/utils/make-test-todo-repository'
import { test, expect, Page } from '@playwright/test'

const HOME_URL = '/'
const HEADING = 'Lista de tarefas'
const INPUT = 'Tarefa'
const BUTTON = 'Criar tarefa'
const BUTTON_BUSY = 'Criar tarefa...'
const NEW_TODO_TEXT = 'New Todo'

//helpers
const getHeading = (p: Page) => p.getByRole('heading', { name: HEADING })
const getInput = (p: Page) => p.getByRole('textbox', { name: INPUT })
const getBtn = (p: Page) => p.getByRole('button', { name: BUTTON })
const getBtnBusy = (p: Page) => p.getByRole('button', { name: BUTTON_BUSY })

const getAll = (p: Page) => ({
    heading: getHeading(p),
    input: getInput(p),
    btn: getBtn(p),
    btnBusy: getBtnBusy(p)

})


test.beforeEach(async ({ page }) => {
    const { deleteTodoNoWhere } = await makeTestTodoRepository()
    await deleteTodoNoWhere()

    await page.goto(HOME_URL)
})

test.afterAll(async ({ }) => {
    const { deleteTodoNoWhere } = await makeTestTodoRepository()
    await deleteTodoNoWhere()
})

test.describe('<Home /> (E2E)', () => {
    // Renderização 
    test.describe('Renderização', () => {
        test('deve ter o title html correto', async ({ page }) => { //recebo a minha pagina 
            await expect(page).toHaveTitle('Testes com Vitest e Playwright')
        })

        test('deve renderizar o cabeçalho, o input e o botão para criar TODOs', async ({ page }) => {
            await expect(getHeading(page)).toBeVisible()
            await expect(getInput(page)).toBeVisible()
            await expect(getBtn(page)).toBeVisible()
        })


    })
    test.describe('Criação', () => {
        test('deve permitir criar um TODO', async ({ page }) => { //
            const { btn, input } = getAll(page) //pego meus elementos que estou na pagina

            await input.fill(NEW_TODO_TEXT) /// digito um texto no inout
            await btn.click() //pego o botão e clico nele 

            const createdTodo = page
                .getByRole('listitem') //pego meu elemento listitem 
                .filter({ hasText: NEW_TODO_TEXT }) //filtro o elemento que tem esse determinado texto NEW_TODO_TEXT
            await expect(createdTodo).toBeVisible()//por fim espero que esse elemento esteja na pagina  
        })
        test('deve fazer o trim da descrição do input ao criar o TODO', async ({
            page,
        }) => {
            const { btn, input } = getAll(page);

            const textToBeTrimmed = '   no spaces here   ';
            const textTrimmed = textToBeTrimmed.trim();

            await input.fill(textToBeTrimmed);
            await btn.click();

            const createdTodo = page
                .getByRole('listitem')
                .filter({ hasText: textTrimmed });
            const createdTodoText = await createdTodo.textContent();

            await expect(createdTodoText).toBe(textTrimmed);
        });
    })
})
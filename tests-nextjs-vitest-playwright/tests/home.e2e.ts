import { insertTestTodos, makeTestTodoRepository } from '@/core/__tests__/utils/make-test-todo-repository' // Importa a função que cria o repositório de testes
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
        test('deve limpar o input após criar o TODO', async ({ page }) => { // O que o teste verifica: se o input é limpo após criar a tarefa
            const { btn, input } = getAll(page) // Pego os elementos da página
            await input.fill(NEW_TODO_TEXT) // Digito o texto
            await btn.click()

            await expect(input).toHaveValue('') // Espero que o input esteja vazio após criar a tarefa

        })
    })
    test.describe('Exclusão', () => { // Sub-descrição: testes de exclusão de tarefas
        test('deve permitir apagar um todo', async ({ page }) => { // O que o teste verifica: se consigo apagar uma tarefa específica
            const todos = await insertTestTodos() // Crio as tarefas de teste no banco de dados
            await page.reload() // Recarrego a página para o Next.js revalidar o cache e mostrar as tarefas

            const itemToDelete = page // Pego a página
                .getByRole('listitem') // Pego os elementos da lista
                .filter({ hasText: todos[1].description }) // Filtro a tarefa pelo texto da descrição que está no índice 1
            await expect(itemToDelete).toBeVisible() // Verifico se essa tarefa específica está visível na tela

            const deleteBtn = itemToDelete.getByRole('button') // Se está visível, pego o botão de deletar
            await deleteBtn.click() // Clico no botão para apagar

            await itemToDelete.waitFor({ state: 'detached' }) // Espero até que o item seja removido do DOM da página
            await expect(itemToDelete).not.toBeVisible() // Verifico se ele realmente não está mais visível
        })

        test('deve permitir apagar todos os TODOs', async ({ page }) => {
            await insertTestTodos() // Crio as tarefas de teste no banco de dados
            await page.reload() // Recarrego a página para o Next.js revalidar o cache e mostrar as novas tarefas

            while (true) { // Inicio um loop infinito (que só vai parar quando não houver mais itens)
                const item = page.getByRole('listitem').first()  // Pego o primeiro item da lista de tarefas
                const isVisible = await item.isVisible().catch(() => false) // Verifico se esse item está visível na tela (se der erro, considero como false)
                if (!isVisible) break // Se o item não estiver visível, significa que a lista acabou, então quebro o loop

                const text = await item.textContent() // Pego o texto da descrição do item que vou apagar
                if (!text) { // Se o texto vier vazio ou nulo
                    throw Error('Item text not found') // Lanço um erro avisando que não encontrei o texto
                }

                const deleteBtn = item.getByRole('button') // Busco o botão de deletar DENTRO desse item específico
                await deleteBtn.click()// Clico no botão para apagar a tarefa

                const renewdItem = page // Pego a página novamente
                    .getByRole('listitem') // Busco os itens da lista
                    .filter({ hasText: text })// Filtro pelo texto do item que acabei de apagar
                await renewdItem.waitFor({ state: 'detached' }) // Espero até que esse item seja removido do DOM (desanexado)
                await expect(renewdItem).not.toBeVisible() // Confirmo que ele realmente não está mais visível na página
            }
        })

        test('deve desativar os items da lista enquanto envia a action', async ({ page }) => {
            await insertTestTodos() // Crio as tarefas no banco de dados
            await page.reload() // Recarrego a página para o Next.js revalidar o cache e mostrar as tarefas

            const itemToBeDeleted = page.getByRole('listitem').first() // Pego o primeiro item da minha lista
            const itemToBeDeletedText = await itemToBeDeleted.textContent() // Pego o texto da descrição do meu item

            if (!itemToBeDeletedText) { // Se o meu item não tiver um texto (descrição)
                throw new Error('Item text is empty') // Lanço esse erro para avisar
            }

            const deleteBtn = itemToBeDeleted.getByRole('button') // Pego o botão de deletar do meu item da lista 
            await deleteBtn.click() // Clico no botão que vai realizar a deleção 

            const allDeleteButtons = await page // Pego a página novamente
                .getByRole('button', { name: /^apagar:/i }) // Busco TODOS os botões que tenham o nome acessível começando com "apagar:"
                .all() // E pego a lista completa desses botões

            for (const btn of allDeleteButtons) { // Faço um looping por todos os botões de apagar
                await expect(btn).toBeDisabled() // Verifico se cada um deles está desativado enquanto a ação roda
            }

            const deleteItemNotVisible = page // Pego a página novamente
                .getByRole('listitem') // Busco os itens da lista
                .filter({ hasText: itemToBeDeletedText }) // Filtro a tarefa pelo texto que acabou de ser excluída

            await deleteItemNotVisible.waitFor({ state: 'detached' }) // Espero até que o item seja removido do DOM
            await expect(deleteItemNotVisible).not.toBeVisible() // Confirmo que ele não está mais visível na página

            const renewdAllButtons = await page // Pego a página novamente
                .getByRole('button', { name: /^apagar:/i }) // Busco todos os botões de apagar restantes
                .all() // Pego a lista completa

            for (const btn of renewdAllButtons) { // Faço um looping por todos os botões restantes
                await expect(btn).toBeEnabled() // Espero que eles estejam habilitados novamente (pois a ação terminou)
            }
        })
    })
test.describe('Erros', () => { // Sub-descrição: testes de tratamento de erros do formulário
    test('deve mostrar erro se a descrição tem 3 ou menos caracteres', async ({ page }) => { // O que o teste verifica: se o erro de validação de tamanho aparece
        const { input, btn } = getAll(page) // Pego os elementos da página

        await input.fill('abc') // Digito um texto com 3 caracteres (inválido)
        await btn.click() // Clico no botão para tentar criar

        const errorText = 'Descrição precisa ter mais de 3 caracteres' // Defino o texto do erro esperado
        const error = page.getByText(errorText) // Busco o elemento que contém essa mensagem de erro

        await error.waitFor({ state: 'attached', timeout: 5000 }) // Espero que o elemento seja anexado ao DOM (criado na tela)
        await expect(error).toBeVisible() // Verifico se o erro está realmente visível para o usuário
    })

    test('deve mostrar se um TODO já existir com a mesma descrição', async ({ page }) => { // O que o teste verifica: se o erro de duplicidade aparece
        const { input, btn } = getAll(page) // Pego os elementos da página

        await input.fill('eu já existo') // Digito um texto válido
        await btn.click() // Clico para criar a primeira tarefa

        await input.fill('eu já existo') // Digito exatamente o mesmo texto
        await btn.click() // Tento criar a segunda tarefa (duplicada)

        const errorText = 'Já existe um todo com ID ou descrição enviados' // Defino o texto do erro esperado
        const error = page.getByText(errorText) // Busco o elemento com a mensagem de erro

        await error.waitFor({ state: 'attached', timeout: 5000 }) // Espero o erro aparecer no DOM
        await expect(error).toBeVisible() // Verifico se ele está visível na tela
    })

    test('deve remover o erro da tela quando o usuário corrigir o erro', async ({ page }) => { // O que o teste verifica: se o erro some ao digitar um texto válido
        const { input, btn } = getAll(page) // Pego os elementos da página

        await input.fill('abc') // Digito um texto inválido
        await btn.click() // Clico para tentar criar

        const errorText = 'Descrição precisa ter mais de 3 caracteres' // Defino o texto do erro esperado
        const error = page.getByText(errorText) // Busco o elemento com a mensagem de erro

        await error.waitFor({ state: 'attached', timeout: 5000 }) // Espero o erro aparecer na tela
        await expect(error).toBeVisible() // Confirmo que ele está visível

        await input.fill('Essa descrição é valida') // Agora digito um texto válido
        await btn.click() // Clico novamente para criar

        await error.waitFor({ state: 'detached', timeout: 5000 }) // Espero que o erro seja removido do DOM (desanexado)
        await expect(error).not.toBeVisible() // Confirmo que o erro NÃO está mais visível na tela
    })
})
})
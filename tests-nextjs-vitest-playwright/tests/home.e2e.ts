import {test, expect} from '@playwright/test'

test.describe('<Home /> (E2E)',  () => {
    // Renderização 
    test.describe('Renderização', () => {
        test('deve ter o title html correto', async ({page}) => { //recebo a minha pagina 
            await page.goto('/') //peço para minha página acessar esse caminho

            await page.waitForTimeout(6000)
        } ) 
            
    })
})
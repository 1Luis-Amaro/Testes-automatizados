import { sanitizeStr } from "./sanitize-str"

describe('sanitizeStr (unit)', () => {
    test('retorna uma string vazia quando recebe um valor falso', () => {
        // @ts-expect-error testando a função sem parametro
        expect(sanitizeStr()).toBe('')
    })

     test('retorna uma string vazia quando recebe um valor que NÃO é uma STRING', () => {
        // @ts-expect-error testando a função com tipagem incorreta
        expect(sanitizeStr(123)).toBe('')
    })

      test('garante o trim da string enviada', () => {
        expect(sanitizeStr( '   a        ')).toBe('a')
    })

       test('garante que a string é normalizada com NFC', () => {
        const original = 'e\u0301';
        const expected = 'é'
        expect(expected).toBe(sanitizeStr(original))
    })
})
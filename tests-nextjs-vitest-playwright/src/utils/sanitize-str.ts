export function sanitizeStr(s: string) { //função de verificação de string
 //se o que eu recebi que é o s estiver vazio ou for diferente de uma string vou receber
 //  uma string vazia, o trim tira todos os espaços da ponta esquerda e direita e depois normalizo os caracteres da string
    return !s || typeof s !== 'string' ? '' : s.trim().normalize()
    
}

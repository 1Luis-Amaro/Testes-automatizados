import { InferInsertModel, InferSelectModel } from "drizzle-orm"; // Importo utilitários do Drizzle que geram tipos automaticamente a partir da tabela (InferSelectModel = tipo para SELECT, InferInsertModel = tipo para INSERT)
import { sqliteTable, text } from "drizzle-orm/sqlite-core"; // Importo a função sqliteTable (para criar tabelas no SQLite) e o tipo text (para colunas de texto)

export const todoTable = sqliteTable('todo', { //criando minha tablea com o nome todo, e depois as colunas dela
    id: text('id').primaryKey(), //coluna id, ela é um texto e é chave unica
    description: text('description').notNull().unique(), /// Coluna 'description': é um texto, não pode ser nula (notNull) e não pode ter valores repetidos (unique)
    createdAt: text('created_at').notNull() // Coluna 'created_at': é um texto, não pode ser nula (notNull). O nome no banco usa snake_case (created_at), mas no código usamos camelCase (createdAt)

})

//tipos que eu criei 
export type TodoTableSelectModel = InferSelectModel<typeof todoTable> /// Tipo para SELECT (quando você busca dados do banco): todos os campos são obrigatórios
export type TodoTableInsertModel = InferInsertModel<typeof todoTable> // Tipo para INSERT (quando você insere dados no banco): campos com default são opcionais
import { todoTable } from "@/core/todo/schemas/drizzle-todo-table.schema"; // Importa a definição da tabela 'todo' do banco de dados
import { getFullEnv } from "@/env/config"; // Importa a função que carrega as configurações do ambiente (.env)
import Database from "better-sqlite3"; // Importa a classe Database do better-sqlite3 (driver do SQLite)
import { drizzle } from "drizzle-orm/better-sqlite3"; // Importa a função drizzle para conectar o Drizzle ORM ao SQLite
import { migrate } from "drizzle-orm/better-sqlite3/migrator"; // Importa a função migrate para rodar as migrações do banco

const makeDrizzle = () => { // Cria uma função que monta a conexão com o banco
  const { databaseFile, currentEnv, drizzleMigrationsFolder } = getFullEnv(); // Pega do .env: o arquivo do banco, o ambiente atual e a pasta de migrações
  const sqliteDatabase = new Database(databaseFile); // Abre (ou cria) o arquivo do banco SQLite

  const db = drizzle(sqliteDatabase, { // Cria a instância do Drizzle passando a conexão SQLite
    schema: { todo: todoTable }, // Registra o schema da tabela 'todo' para o Drizzle saber como consultar
  });

  if (['test', 'e2e'].includes(currentEnv)) { // Se o ambiente for 'test' ou 'e2e' (testes automatizados)
    migrate(db, { migrationsFolder: drizzleMigrationsFolder }); // Roda as migrações para garantir que o banco esteja atualizado
  }

  return db; // Retorna a instância do Drizzle pronta para uso
};

declare global { // Declara tipos globais para o TypeScript
  // eslint-disable-next-line no-var
  var __DB__: DrizzleDatabase; // Declara a variável global __DB__ que guarda a conexão com o banco
}

if (!globalThis.__DB__) { // Se a variável global __DB__ ainda não existe (primeira vez que o arquivo é executado)
  globalThis.__DB__ = makeDrizzle(); // Cria a conexão com o banco e guarda na variável global (evita criar várias conexões)
}

export const drizzleDatabase = { // Exporta um objeto com a conexão e a tabela
  db: globalThis.__DB__, // A conexão com o banco (instância do Drizzle)
  todoTable, // A definição da tabela 'todo' (para usar em queries)
};

export type DrizzleDatabase = ReturnType<typeof makeDrizzle>; // Cria um tipo TypeScript a partir do retorno da função makeDrizzle (para usar em outros lugares)
import type { ExtractTablesWithRelations } from 'drizzle-orm'
import type { PgTransaction } from 'drizzle-orm/pg-core'
import type { PostgresJsQueryResultHKT } from 'drizzle-orm/postgres-js'
import type { useTranslations } from 'next-intl'
import type * as schemas from '@/db/schemas'

export type DeepObject = {
  [key: string]: string | DeepObject
}

export type Translator = ReturnType<typeof useTranslations<never>>

export type Transaction = PgTransaction<
  PostgresJsQueryResultHKT,
  typeof schemas,
  ExtractTablesWithRelations<typeof schemas>
>

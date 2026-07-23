import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "header" ADD COLUMN "cta_button_label" varchar DEFAULT 'Get Started';
  ALTER TABLE "header" ADD COLUMN "cta_button_url" varchar;`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "header" DROP COLUMN "cta_button_label";
  ALTER TABLE "header" DROP COLUMN "cta_button_url";`)
}

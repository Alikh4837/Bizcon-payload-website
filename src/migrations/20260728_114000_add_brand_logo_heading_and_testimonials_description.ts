import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "pages_blocks_testimonials_block" ADD COLUMN "description" varchar;
  ALTER TABLE "pages_blocks_brand_logo_row_block" ADD COLUMN "heading" varchar;
  ALTER TABLE "_pages_v_blocks_testimonials_block" ADD COLUMN "description" varchar;
  ALTER TABLE "_pages_v_blocks_brand_logo_row_block" ADD COLUMN "heading" varchar;`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "pages_blocks_testimonials_block" DROP COLUMN "description";
  ALTER TABLE "pages_blocks_brand_logo_row_block" DROP COLUMN "heading";
  ALTER TABLE "_pages_v_blocks_testimonials_block" DROP COLUMN "description";
  ALTER TABLE "_pages_v_blocks_brand_logo_row_block" DROP COLUMN "heading";`)
}

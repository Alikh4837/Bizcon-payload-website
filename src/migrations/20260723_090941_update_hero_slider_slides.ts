import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "pages_hero_gallery_images" ADD COLUMN "heading" varchar;
  ALTER TABLE "pages_hero_gallery_images" ADD COLUMN "description" varchar;
  ALTER TABLE "_pages_v_version_hero_gallery_images" ADD COLUMN "heading" varchar;
  ALTER TABLE "_pages_v_version_hero_gallery_images" ADD COLUMN "description" varchar;`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "pages_hero_gallery_images" DROP COLUMN "heading";
  ALTER TABLE "pages_hero_gallery_images" DROP COLUMN "description";
  ALTER TABLE "_pages_v_version_hero_gallery_images" DROP COLUMN "heading";
  ALTER TABLE "_pages_v_version_hero_gallery_images" DROP COLUMN "description";`)
}

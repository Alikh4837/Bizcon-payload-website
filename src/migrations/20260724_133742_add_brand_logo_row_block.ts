import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TABLE "pages_blocks_brand_logo_row_block_logos" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"logo_id" integer,
  	"link" varchar
  );
  
  CREATE TABLE "pages_blocks_brand_logo_row_block" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_brand_logo_row_block_logos" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"logo_id" integer,
  	"link" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_brand_logo_row_block" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  ALTER TABLE "pages_blocks_brand_logo_row_block_logos" ADD CONSTRAINT "pages_blocks_brand_logo_row_block_logos_logo_id_media_id_fk" FOREIGN KEY ("logo_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages_blocks_brand_logo_row_block_logos" ADD CONSTRAINT "pages_blocks_brand_logo_row_block_logos_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_brand_logo_row_block"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_brand_logo_row_block" ADD CONSTRAINT "pages_blocks_brand_logo_row_block_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_brand_logo_row_block_logos" ADD CONSTRAINT "_pages_v_blocks_brand_logo_row_block_logos_logo_id_media_id_fk" FOREIGN KEY ("logo_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_brand_logo_row_block_logos" ADD CONSTRAINT "_pages_v_blocks_brand_logo_row_block_logos_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_brand_logo_row_block"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_brand_logo_row_block" ADD CONSTRAINT "_pages_v_blocks_brand_logo_row_block_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "pages_blocks_brand_logo_row_block_logos_order_idx" ON "pages_blocks_brand_logo_row_block_logos" USING btree ("_order");
  CREATE INDEX "pages_blocks_brand_logo_row_block_logos_parent_id_idx" ON "pages_blocks_brand_logo_row_block_logos" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_brand_logo_row_block_logos_logo_idx" ON "pages_blocks_brand_logo_row_block_logos" USING btree ("logo_id");
  CREATE INDEX "pages_blocks_brand_logo_row_block_order_idx" ON "pages_blocks_brand_logo_row_block" USING btree ("_order");
  CREATE INDEX "pages_blocks_brand_logo_row_block_parent_id_idx" ON "pages_blocks_brand_logo_row_block" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_brand_logo_row_block_path_idx" ON "pages_blocks_brand_logo_row_block" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_brand_logo_row_block_logos_order_idx" ON "_pages_v_blocks_brand_logo_row_block_logos" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_brand_logo_row_block_logos_parent_id_idx" ON "_pages_v_blocks_brand_logo_row_block_logos" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_brand_logo_row_block_logos_logo_idx" ON "_pages_v_blocks_brand_logo_row_block_logos" USING btree ("logo_id");
  CREATE INDEX "_pages_v_blocks_brand_logo_row_block_order_idx" ON "_pages_v_blocks_brand_logo_row_block" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_brand_logo_row_block_parent_id_idx" ON "_pages_v_blocks_brand_logo_row_block" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_brand_logo_row_block_path_idx" ON "_pages_v_blocks_brand_logo_row_block" USING btree ("_path");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   DROP TABLE "pages_blocks_brand_logo_row_block_logos" CASCADE;
  DROP TABLE "pages_blocks_brand_logo_row_block" CASCADE;
  DROP TABLE "_pages_v_blocks_brand_logo_row_block_logos" CASCADE;
  DROP TABLE "_pages_v_blocks_brand_logo_row_block" CASCADE;`)
}

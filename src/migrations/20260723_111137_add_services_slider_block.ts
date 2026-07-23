import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TABLE "pages_blocks_services_slider_block_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"image_id" integer,
  	"badge" varchar,
  	"title" varchar,
  	"tag" varchar,
  	"link" varchar
  );
  
  CREATE TABLE "pages_blocks_services_slider_block" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"eyebrow" varchar DEFAULT 'Creative Approach',
  	"heading" varchar DEFAULT 'Our Services',
  	"description" varchar,
  	"show_footer_note" boolean DEFAULT true,
  	"footer_note" varchar DEFAULT 'Save your precious time and effort spent for finding a solution.',
  	"footer_link_label" varchar DEFAULT 'Contact us now',
  	"footer_link" varchar DEFAULT '/contact',
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_services_slider_block_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"image_id" integer,
  	"badge" varchar,
  	"title" varchar,
  	"tag" varchar,
  	"link" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_services_slider_block" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"eyebrow" varchar DEFAULT 'Creative Approach',
  	"heading" varchar DEFAULT 'Our Services',
  	"description" varchar,
  	"show_footer_note" boolean DEFAULT true,
  	"footer_note" varchar DEFAULT 'Save your precious time and effort spent for finding a solution.',
  	"footer_link_label" varchar DEFAULT 'Contact us now',
  	"footer_link" varchar DEFAULT '/contact',
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  ALTER TABLE "pages_blocks_services_slider_block_items" ADD CONSTRAINT "pages_blocks_services_slider_block_items_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages_blocks_services_slider_block_items" ADD CONSTRAINT "pages_blocks_services_slider_block_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_services_slider_block"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_services_slider_block" ADD CONSTRAINT "pages_blocks_services_slider_block_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_services_slider_block_items" ADD CONSTRAINT "_pages_v_blocks_services_slider_block_items_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_services_slider_block_items" ADD CONSTRAINT "_pages_v_blocks_services_slider_block_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_services_slider_block"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_services_slider_block" ADD CONSTRAINT "_pages_v_blocks_services_slider_block_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "pages_blocks_services_slider_block_items_order_idx" ON "pages_blocks_services_slider_block_items" USING btree ("_order");
  CREATE INDEX "pages_blocks_services_slider_block_items_parent_id_idx" ON "pages_blocks_services_slider_block_items" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_services_slider_block_items_image_idx" ON "pages_blocks_services_slider_block_items" USING btree ("image_id");
  CREATE INDEX "pages_blocks_services_slider_block_order_idx" ON "pages_blocks_services_slider_block" USING btree ("_order");
  CREATE INDEX "pages_blocks_services_slider_block_parent_id_idx" ON "pages_blocks_services_slider_block" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_services_slider_block_path_idx" ON "pages_blocks_services_slider_block" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_services_slider_block_items_order_idx" ON "_pages_v_blocks_services_slider_block_items" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_services_slider_block_items_parent_id_idx" ON "_pages_v_blocks_services_slider_block_items" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_services_slider_block_items_image_idx" ON "_pages_v_blocks_services_slider_block_items" USING btree ("image_id");
  CREATE INDEX "_pages_v_blocks_services_slider_block_order_idx" ON "_pages_v_blocks_services_slider_block" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_services_slider_block_parent_id_idx" ON "_pages_v_blocks_services_slider_block" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_services_slider_block_path_idx" ON "_pages_v_blocks_services_slider_block" USING btree ("_path");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   DROP TABLE "pages_blocks_services_slider_block_items" CASCADE;
  DROP TABLE "pages_blocks_services_slider_block" CASCADE;
  DROP TABLE "_pages_v_blocks_services_slider_block_items" CASCADE;
  DROP TABLE "_pages_v_blocks_services_slider_block" CASCADE;`)
}

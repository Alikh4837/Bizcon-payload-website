import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_pages_blocks_services_faq_block_badge_icon" AS ENUM('MessageCircleQuestion', 'MessageCircle', 'HelpCircle', 'Users');
  CREATE TYPE "public"."enum__pages_v_blocks_services_faq_block_badge_icon" AS ENUM('MessageCircleQuestion', 'MessageCircle', 'HelpCircle', 'Users');
  CREATE TABLE "pages_blocks_services_faq_block_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"question" varchar,
  	"answer" varchar
  );
  
  CREATE TABLE "pages_blocks_services_faq_block" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"eyebrow" varchar DEFAULT 'Frequently Asked Questions',
  	"heading" varchar DEFAULT 'What we can do for you and company.',
  	"image_id" integer,
  	"badge_icon" "enum_pages_blocks_services_faq_block_badge_icon" DEFAULT 'MessageCircleQuestion',
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_services_faq_block_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"question" varchar,
  	"answer" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_services_faq_block" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"eyebrow" varchar DEFAULT 'Frequently Asked Questions',
  	"heading" varchar DEFAULT 'What we can do for you and company.',
  	"image_id" integer,
  	"badge_icon" "enum__pages_v_blocks_services_faq_block_badge_icon" DEFAULT 'MessageCircleQuestion',
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  ALTER TABLE "pages_blocks_services_faq_block_items" ADD CONSTRAINT "pages_blocks_services_faq_block_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_services_faq_block"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_services_faq_block" ADD CONSTRAINT "pages_blocks_services_faq_block_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages_blocks_services_faq_block" ADD CONSTRAINT "pages_blocks_services_faq_block_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_services_faq_block_items" ADD CONSTRAINT "_pages_v_blocks_services_faq_block_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_services_faq_block"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_services_faq_block" ADD CONSTRAINT "_pages_v_blocks_services_faq_block_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_services_faq_block" ADD CONSTRAINT "_pages_v_blocks_services_faq_block_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "pages_blocks_services_faq_block_items_order_idx" ON "pages_blocks_services_faq_block_items" USING btree ("_order");
  CREATE INDEX "pages_blocks_services_faq_block_items_parent_id_idx" ON "pages_blocks_services_faq_block_items" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_services_faq_block_order_idx" ON "pages_blocks_services_faq_block" USING btree ("_order");
  CREATE INDEX "pages_blocks_services_faq_block_parent_id_idx" ON "pages_blocks_services_faq_block" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_services_faq_block_path_idx" ON "pages_blocks_services_faq_block" USING btree ("_path");
  CREATE INDEX "pages_blocks_services_faq_block_image_idx" ON "pages_blocks_services_faq_block" USING btree ("image_id");
  CREATE INDEX "_pages_v_blocks_services_faq_block_items_order_idx" ON "_pages_v_blocks_services_faq_block_items" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_services_faq_block_items_parent_id_idx" ON "_pages_v_blocks_services_faq_block_items" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_services_faq_block_order_idx" ON "_pages_v_blocks_services_faq_block" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_services_faq_block_parent_id_idx" ON "_pages_v_blocks_services_faq_block" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_services_faq_block_path_idx" ON "_pages_v_blocks_services_faq_block" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_services_faq_block_image_idx" ON "_pages_v_blocks_services_faq_block" USING btree ("image_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   DROP TABLE "pages_blocks_services_faq_block_items" CASCADE;
  DROP TABLE "pages_blocks_services_faq_block" CASCADE;
  DROP TABLE "_pages_v_blocks_services_faq_block_items" CASCADE;
  DROP TABLE "_pages_v_blocks_services_faq_block" CASCADE;
  DROP TYPE "public"."enum_pages_blocks_services_faq_block_badge_icon";
  DROP TYPE "public"."enum__pages_v_blocks_services_faq_block_badge_icon";`)
}

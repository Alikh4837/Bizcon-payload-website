import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_pages_blocks_achievement_block_cta_link_type" AS ENUM('reference', 'custom');
  CREATE TYPE "public"."enum_pages_blocks_achievement_block_cta_link_appearance" AS ENUM('default');
  CREATE TYPE "public"."enum_pages_blocks_achievement_block_image_background" AS ENUM('primary', 'gray');
  CREATE TYPE "public"."enum_pages_blocks_achievement_block_badge_icon" AS ENUM('Award', 'Star', 'Target', 'Rocket', 'TrendingUp', 'ShieldCheck');
  CREATE TYPE "public"."enum__pages_v_blocks_achievement_block_cta_link_type" AS ENUM('reference', 'custom');
  CREATE TYPE "public"."enum__pages_v_blocks_achievement_block_cta_link_appearance" AS ENUM('default');
  CREATE TYPE "public"."enum__pages_v_blocks_achievement_block_image_background" AS ENUM('primary', 'gray');
  CREATE TYPE "public"."enum__pages_v_blocks_achievement_block_badge_icon" AS ENUM('Award', 'Star', 'Target', 'Rocket', 'TrendingUp', 'ShieldCheck');
  CREATE TABLE "pages_blocks_achievement_block_cta" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"link_type" "enum_pages_blocks_achievement_block_cta_link_type" DEFAULT 'reference',
  	"link_new_tab" boolean,
  	"link_url" varchar,
  	"link_label" varchar,
  	"link_appearance" "enum_pages_blocks_achievement_block_cta_link_appearance" DEFAULT 'default'
  );
  
  CREATE TABLE "pages_blocks_achievement_block_stats" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"number" numeric,
  	"suffix" varchar,
  	"label" varchar
  );
  
  CREATE TABLE "pages_blocks_achievement_block" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"eyebrow" varchar,
  	"title" varchar,
  	"description" varchar,
  	"phone_number" varchar,
  	"image_id" integer,
  	"image_background" "enum_pages_blocks_achievement_block_image_background" DEFAULT 'primary',
  	"badge_icon" "enum_pages_blocks_achievement_block_badge_icon" DEFAULT 'Award',
  	"badge_label" varchar,
  	"stat_number" numeric,
  	"stat_suffix" varchar DEFAULT '+',
  	"stat_label" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_achievement_block_cta" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"link_type" "enum__pages_v_blocks_achievement_block_cta_link_type" DEFAULT 'reference',
  	"link_new_tab" boolean,
  	"link_url" varchar,
  	"link_label" varchar,
  	"link_appearance" "enum__pages_v_blocks_achievement_block_cta_link_appearance" DEFAULT 'default',
  	"_uuid" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_achievement_block_stats" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"number" numeric,
  	"suffix" varchar,
  	"label" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_achievement_block" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"eyebrow" varchar,
  	"title" varchar,
  	"description" varchar,
  	"phone_number" varchar,
  	"image_id" integer,
  	"image_background" "enum__pages_v_blocks_achievement_block_image_background" DEFAULT 'primary',
  	"badge_icon" "enum__pages_v_blocks_achievement_block_badge_icon" DEFAULT 'Award',
  	"badge_label" varchar,
  	"stat_number" numeric,
  	"stat_suffix" varchar DEFAULT '+',
  	"stat_label" varchar,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  ALTER TABLE "pages_blocks_achievement_block_cta" ADD CONSTRAINT "pages_blocks_achievement_block_cta_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_achievement_block"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_achievement_block_stats" ADD CONSTRAINT "pages_blocks_achievement_block_stats_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_achievement_block"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_achievement_block" ADD CONSTRAINT "pages_blocks_achievement_block_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages_blocks_achievement_block" ADD CONSTRAINT "pages_blocks_achievement_block_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_achievement_block_cta" ADD CONSTRAINT "_pages_v_blocks_achievement_block_cta_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_achievement_block"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_achievement_block_stats" ADD CONSTRAINT "_pages_v_blocks_achievement_block_stats_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_achievement_block"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_achievement_block" ADD CONSTRAINT "_pages_v_blocks_achievement_block_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_achievement_block" ADD CONSTRAINT "_pages_v_blocks_achievement_block_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "pages_blocks_achievement_block_cta_order_idx" ON "pages_blocks_achievement_block_cta" USING btree ("_order");
  CREATE INDEX "pages_blocks_achievement_block_cta_parent_id_idx" ON "pages_blocks_achievement_block_cta" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_achievement_block_stats_order_idx" ON "pages_blocks_achievement_block_stats" USING btree ("_order");
  CREATE INDEX "pages_blocks_achievement_block_stats_parent_id_idx" ON "pages_blocks_achievement_block_stats" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_achievement_block_order_idx" ON "pages_blocks_achievement_block" USING btree ("_order");
  CREATE INDEX "pages_blocks_achievement_block_parent_id_idx" ON "pages_blocks_achievement_block" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_achievement_block_path_idx" ON "pages_blocks_achievement_block" USING btree ("_path");
  CREATE INDEX "pages_blocks_achievement_block_image_idx" ON "pages_blocks_achievement_block" USING btree ("image_id");
  CREATE INDEX "_pages_v_blocks_achievement_block_cta_order_idx" ON "_pages_v_blocks_achievement_block_cta" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_achievement_block_cta_parent_id_idx" ON "_pages_v_blocks_achievement_block_cta" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_achievement_block_stats_order_idx" ON "_pages_v_blocks_achievement_block_stats" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_achievement_block_stats_parent_id_idx" ON "_pages_v_blocks_achievement_block_stats" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_achievement_block_order_idx" ON "_pages_v_blocks_achievement_block" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_achievement_block_parent_id_idx" ON "_pages_v_blocks_achievement_block" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_achievement_block_path_idx" ON "_pages_v_blocks_achievement_block" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_achievement_block_image_idx" ON "_pages_v_blocks_achievement_block" USING btree ("image_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   DROP TABLE "pages_blocks_achievement_block_cta" CASCADE;
  DROP TABLE "pages_blocks_achievement_block_stats" CASCADE;
  DROP TABLE "pages_blocks_achievement_block" CASCADE;
  DROP TABLE "_pages_v_blocks_achievement_block_cta" CASCADE;
  DROP TABLE "_pages_v_blocks_achievement_block_stats" CASCADE;
  DROP TABLE "_pages_v_blocks_achievement_block" CASCADE;
  DROP TYPE "public"."enum_pages_blocks_achievement_block_cta_link_type";
  DROP TYPE "public"."enum_pages_blocks_achievement_block_cta_link_appearance";
  DROP TYPE "public"."enum_pages_blocks_achievement_block_image_background";
  DROP TYPE "public"."enum_pages_blocks_achievement_block_badge_icon";
  DROP TYPE "public"."enum__pages_v_blocks_achievement_block_cta_link_type";
  DROP TYPE "public"."enum__pages_v_blocks_achievement_block_cta_link_appearance";
  DROP TYPE "public"."enum__pages_v_blocks_achievement_block_image_background";
  DROP TYPE "public"."enum__pages_v_blocks_achievement_block_badge_icon";`)
}

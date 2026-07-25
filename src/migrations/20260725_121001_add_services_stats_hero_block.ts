import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_stats_hero_cta_link_type" AS ENUM('reference', 'custom');
  CREATE TYPE "public"."enum_stats_hero_cta_link_appearance" AS ENUM('default');
  CREATE TYPE "public"."enum_stats_hero_highlight_icon" AS ENUM('Trophy', 'Award', 'Star', 'ShieldCheck', 'Rocket');
  CREATE TYPE "public"."enum__stats_hero_v_cta_link_type" AS ENUM('reference', 'custom');
  CREATE TYPE "public"."enum__stats_hero_v_cta_link_appearance" AS ENUM('default');
  CREATE TYPE "public"."enum__stats_hero_v_highlight_icon" AS ENUM('Trophy', 'Award', 'Star', 'ShieldCheck', 'Rocket');
  CREATE TABLE "stats_hero_stat_cards" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"value" varchar,
  	"show_stars" boolean DEFAULT false,
  	"label" varchar
  );
  
  CREATE TABLE "stats_hero_cta" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"link_type" "enum_stats_hero_cta_link_type" DEFAULT 'reference',
  	"link_new_tab" boolean,
  	"link_url" varchar,
  	"link_label" varchar,
  	"link_appearance" "enum_stats_hero_cta_link_appearance" DEFAULT 'default'
  );
  
  CREATE TABLE "stats_hero" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"eyebrow" varchar DEFAULT 'Creative Approach',
  	"heading" varchar DEFAULT 'Reach your business goals in record time.',
  	"description" varchar,
  	"highlight_icon" "enum_stats_hero_highlight_icon" DEFAULT 'Trophy',
  	"highlight_text" varchar DEFAULT 'Best corporate services agency in world.',
  	"review_count" varchar,
  	"review_text" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_stats_hero_v_stat_cards" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"value" varchar,
  	"show_stars" boolean DEFAULT false,
  	"label" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_stats_hero_v_cta" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"link_type" "enum__stats_hero_v_cta_link_type" DEFAULT 'reference',
  	"link_new_tab" boolean,
  	"link_url" varchar,
  	"link_label" varchar,
  	"link_appearance" "enum__stats_hero_v_cta_link_appearance" DEFAULT 'default',
  	"_uuid" varchar
  );
  
  CREATE TABLE "_stats_hero_v" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"eyebrow" varchar DEFAULT 'Creative Approach',
  	"heading" varchar DEFAULT 'Reach your business goals in record time.',
  	"description" varchar,
  	"highlight_icon" "enum__stats_hero_v_highlight_icon" DEFAULT 'Trophy',
  	"highlight_text" varchar DEFAULT 'Best corporate services agency in world.',
  	"review_count" varchar,
  	"review_text" varchar,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  ALTER TABLE "stats_hero_stat_cards" ADD CONSTRAINT "stats_hero_stat_cards_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."stats_hero"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "stats_hero_cta" ADD CONSTRAINT "stats_hero_cta_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."stats_hero"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "stats_hero" ADD CONSTRAINT "stats_hero_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_stats_hero_v_stat_cards" ADD CONSTRAINT "_stats_hero_v_stat_cards_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_stats_hero_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_stats_hero_v_cta" ADD CONSTRAINT "_stats_hero_v_cta_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_stats_hero_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_stats_hero_v" ADD CONSTRAINT "_stats_hero_v_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "stats_hero_stat_cards_order_idx" ON "stats_hero_stat_cards" USING btree ("_order");
  CREATE INDEX "stats_hero_stat_cards_parent_id_idx" ON "stats_hero_stat_cards" USING btree ("_parent_id");
  CREATE INDEX "stats_hero_cta_order_idx" ON "stats_hero_cta" USING btree ("_order");
  CREATE INDEX "stats_hero_cta_parent_id_idx" ON "stats_hero_cta" USING btree ("_parent_id");
  CREATE INDEX "stats_hero_order_idx" ON "stats_hero" USING btree ("_order");
  CREATE INDEX "stats_hero_parent_id_idx" ON "stats_hero" USING btree ("_parent_id");
  CREATE INDEX "stats_hero_path_idx" ON "stats_hero" USING btree ("_path");
  CREATE INDEX "_stats_hero_v_stat_cards_order_idx" ON "_stats_hero_v_stat_cards" USING btree ("_order");
  CREATE INDEX "_stats_hero_v_stat_cards_parent_id_idx" ON "_stats_hero_v_stat_cards" USING btree ("_parent_id");
  CREATE INDEX "_stats_hero_v_cta_order_idx" ON "_stats_hero_v_cta" USING btree ("_order");
  CREATE INDEX "_stats_hero_v_cta_parent_id_idx" ON "_stats_hero_v_cta" USING btree ("_parent_id");
  CREATE INDEX "_stats_hero_v_order_idx" ON "_stats_hero_v" USING btree ("_order");
  CREATE INDEX "_stats_hero_v_parent_id_idx" ON "_stats_hero_v" USING btree ("_parent_id");
  CREATE INDEX "_stats_hero_v_path_idx" ON "_stats_hero_v" USING btree ("_path");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   DROP TABLE "stats_hero_stat_cards" CASCADE;
  DROP TABLE "stats_hero_cta" CASCADE;
  DROP TABLE "stats_hero" CASCADE;
  DROP TABLE "_stats_hero_v_stat_cards" CASCADE;
  DROP TABLE "_stats_hero_v_cta" CASCADE;
  DROP TABLE "_stats_hero_v" CASCADE;
  DROP TYPE "public"."enum_stats_hero_cta_link_type";
  DROP TYPE "public"."enum_stats_hero_cta_link_appearance";
  DROP TYPE "public"."enum_stats_hero_highlight_icon";
  DROP TYPE "public"."enum__stats_hero_v_cta_link_type";
  DROP TYPE "public"."enum__stats_hero_v_cta_link_appearance";
  DROP TYPE "public"."enum__stats_hero_v_highlight_icon";`)
}

import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TABLE "pages_blocks_trending_block_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"category" varchar,
  	"link" varchar
  );
  
  CREATE TABLE "pages_blocks_trending_block" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"eyebrow" varchar DEFAULT 'Stay Informed',
  	"heading" varchar DEFAULT 'Trending',
  	"description" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_where_we_serve_block_stats" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"value" varchar,
  	"label" varchar
  );
  
  CREATE TABLE "pages_blocks_where_we_serve_block_regions" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"country" varchar,
  	"flag" varchar,
  	"city" varchar,
  	"description" varchar,
  	"link" varchar
  );
  
  CREATE TABLE "pages_blocks_where_we_serve_block" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"eyebrow" varchar DEFAULT 'Global Footprint',
  	"heading" varchar DEFAULT 'Where We Serve',
  	"description" varchar DEFAULT 'With a growing footprint across the Middle East, Europe and South Asia, BizCon Global brings the same depth of accounting, tax and advisory expertise to every market we operate in.',
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_trending_block_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"category" varchar,
  	"link" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_trending_block" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"eyebrow" varchar DEFAULT 'Stay Informed',
  	"heading" varchar DEFAULT 'Trending',
  	"description" varchar,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_where_we_serve_block_stats" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"value" varchar,
  	"label" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_where_we_serve_block_regions" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"country" varchar,
  	"flag" varchar,
  	"city" varchar,
  	"description" varchar,
  	"link" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_where_we_serve_block" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"eyebrow" varchar DEFAULT 'Global Footprint',
  	"heading" varchar DEFAULT 'Where We Serve',
  	"description" varchar DEFAULT 'With a growing footprint across the Middle East, Europe and South Asia, BizCon Global brings the same depth of accounting, tax and advisory expertise to every market we operate in.',
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  ALTER TABLE "pages_blocks_trending_block_items" ADD CONSTRAINT "pages_blocks_trending_block_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_trending_block"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_trending_block" ADD CONSTRAINT "pages_blocks_trending_block_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_where_we_serve_block_stats" ADD CONSTRAINT "pages_blocks_where_we_serve_block_stats_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_where_we_serve_block"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_where_we_serve_block_regions" ADD CONSTRAINT "pages_blocks_where_we_serve_block_regions_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_where_we_serve_block"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_where_we_serve_block" ADD CONSTRAINT "pages_blocks_where_we_serve_block_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_trending_block_items" ADD CONSTRAINT "_pages_v_blocks_trending_block_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_trending_block"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_trending_block" ADD CONSTRAINT "_pages_v_blocks_trending_block_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_where_we_serve_block_stats" ADD CONSTRAINT "_pages_v_blocks_where_we_serve_block_stats_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_where_we_serve_block"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_where_we_serve_block_regions" ADD CONSTRAINT "_pages_v_blocks_where_we_serve_block_regions_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_where_we_serve_block"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_where_we_serve_block" ADD CONSTRAINT "_pages_v_blocks_where_we_serve_block_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "pages_blocks_trending_block_items_order_idx" ON "pages_blocks_trending_block_items" USING btree ("_order");
  CREATE INDEX "pages_blocks_trending_block_items_parent_id_idx" ON "pages_blocks_trending_block_items" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_trending_block_order_idx" ON "pages_blocks_trending_block" USING btree ("_order");
  CREATE INDEX "pages_blocks_trending_block_parent_id_idx" ON "pages_blocks_trending_block" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_trending_block_path_idx" ON "pages_blocks_trending_block" USING btree ("_path");
  CREATE INDEX "pages_blocks_where_we_serve_block_stats_order_idx" ON "pages_blocks_where_we_serve_block_stats" USING btree ("_order");
  CREATE INDEX "pages_blocks_where_we_serve_block_stats_parent_id_idx" ON "pages_blocks_where_we_serve_block_stats" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_where_we_serve_block_regions_order_idx" ON "pages_blocks_where_we_serve_block_regions" USING btree ("_order");
  CREATE INDEX "pages_blocks_where_we_serve_block_regions_parent_id_idx" ON "pages_blocks_where_we_serve_block_regions" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_where_we_serve_block_order_idx" ON "pages_blocks_where_we_serve_block" USING btree ("_order");
  CREATE INDEX "pages_blocks_where_we_serve_block_parent_id_idx" ON "pages_blocks_where_we_serve_block" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_where_we_serve_block_path_idx" ON "pages_blocks_where_we_serve_block" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_trending_block_items_order_idx" ON "_pages_v_blocks_trending_block_items" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_trending_block_items_parent_id_idx" ON "_pages_v_blocks_trending_block_items" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_trending_block_order_idx" ON "_pages_v_blocks_trending_block" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_trending_block_parent_id_idx" ON "_pages_v_blocks_trending_block" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_trending_block_path_idx" ON "_pages_v_blocks_trending_block" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_where_we_serve_block_stats_order_idx" ON "_pages_v_blocks_where_we_serve_block_stats" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_where_we_serve_block_stats_parent_id_idx" ON "_pages_v_blocks_where_we_serve_block_stats" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_where_we_serve_block_regions_order_idx" ON "_pages_v_blocks_where_we_serve_block_regions" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_where_we_serve_block_regions_parent_id_idx" ON "_pages_v_blocks_where_we_serve_block_regions" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_where_we_serve_block_order_idx" ON "_pages_v_blocks_where_we_serve_block" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_where_we_serve_block_parent_id_idx" ON "_pages_v_blocks_where_we_serve_block" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_where_we_serve_block_path_idx" ON "_pages_v_blocks_where_we_serve_block" USING btree ("_path");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   DROP TABLE "pages_blocks_trending_block_items" CASCADE;
  DROP TABLE "pages_blocks_trending_block" CASCADE;
  DROP TABLE "pages_blocks_where_we_serve_block_stats" CASCADE;
  DROP TABLE "pages_blocks_where_we_serve_block_regions" CASCADE;
  DROP TABLE "pages_blocks_where_we_serve_block" CASCADE;
  DROP TABLE "_pages_v_blocks_trending_block_items" CASCADE;
  DROP TABLE "_pages_v_blocks_trending_block" CASCADE;
  DROP TABLE "_pages_v_blocks_where_we_serve_block_stats" CASCADE;
  DROP TABLE "_pages_v_blocks_where_we_serve_block_regions" CASCADE;
  DROP TABLE "_pages_v_blocks_where_we_serve_block" CASCADE;`)
}

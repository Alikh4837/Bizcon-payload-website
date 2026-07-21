import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TABLE "pages_blocks_feature_grid_block_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"heading" varchar,
  	"description" varchar,
  	"link" varchar,
  	"link_label" varchar DEFAULT 'Read More'
  );
  
  CREATE TABLE "pages_blocks_feature_grid_block" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"eyebrow" varchar,
  	"heading" varchar,
  	"show_numbers" boolean DEFAULT false,
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_testimonials_block_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"quote" varchar,
  	"name" varchar,
  	"role" varchar
  );
  
  CREATE TABLE "pages_blocks_testimonials_block" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"eyebrow" varchar DEFAULT 'testimonials',
  	"heading" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_logo_strip_block_logos" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"logo_id" integer,
  	"link" varchar
  );
  
  CREATE TABLE "pages_blocks_logo_strip_block" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"heading" varchar DEFAULT 'We work with the best brands',
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_feature_grid_block_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"heading" varchar,
  	"description" varchar,
  	"link" varchar,
  	"link_label" varchar DEFAULT 'Read More',
  	"_uuid" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_feature_grid_block" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"eyebrow" varchar,
  	"heading" varchar,
  	"show_numbers" boolean DEFAULT false,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_testimonials_block_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"quote" varchar,
  	"name" varchar,
  	"role" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_testimonials_block" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"eyebrow" varchar DEFAULT 'testimonials',
  	"heading" varchar,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_logo_strip_block_logos" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"logo_id" integer,
  	"link" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_logo_strip_block" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"heading" varchar DEFAULT 'We work with the best brands',
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  ALTER TABLE "pages_blocks_feature_grid_block_items" ADD CONSTRAINT "pages_blocks_feature_grid_block_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_feature_grid_block"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_feature_grid_block" ADD CONSTRAINT "pages_blocks_feature_grid_block_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_testimonials_block_items" ADD CONSTRAINT "pages_blocks_testimonials_block_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_testimonials_block"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_testimonials_block" ADD CONSTRAINT "pages_blocks_testimonials_block_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_logo_strip_block_logos" ADD CONSTRAINT "pages_blocks_logo_strip_block_logos_logo_id_media_id_fk" FOREIGN KEY ("logo_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages_blocks_logo_strip_block_logos" ADD CONSTRAINT "pages_blocks_logo_strip_block_logos_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_logo_strip_block"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_logo_strip_block" ADD CONSTRAINT "pages_blocks_logo_strip_block_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_feature_grid_block_items" ADD CONSTRAINT "_pages_v_blocks_feature_grid_block_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_feature_grid_block"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_feature_grid_block" ADD CONSTRAINT "_pages_v_blocks_feature_grid_block_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_testimonials_block_items" ADD CONSTRAINT "_pages_v_blocks_testimonials_block_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_testimonials_block"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_testimonials_block" ADD CONSTRAINT "_pages_v_blocks_testimonials_block_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_logo_strip_block_logos" ADD CONSTRAINT "_pages_v_blocks_logo_strip_block_logos_logo_id_media_id_fk" FOREIGN KEY ("logo_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_logo_strip_block_logos" ADD CONSTRAINT "_pages_v_blocks_logo_strip_block_logos_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_logo_strip_block"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_logo_strip_block" ADD CONSTRAINT "_pages_v_blocks_logo_strip_block_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "pages_blocks_feature_grid_block_items_order_idx" ON "pages_blocks_feature_grid_block_items" USING btree ("_order");
  CREATE INDEX "pages_blocks_feature_grid_block_items_parent_id_idx" ON "pages_blocks_feature_grid_block_items" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_feature_grid_block_order_idx" ON "pages_blocks_feature_grid_block" USING btree ("_order");
  CREATE INDEX "pages_blocks_feature_grid_block_parent_id_idx" ON "pages_blocks_feature_grid_block" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_feature_grid_block_path_idx" ON "pages_blocks_feature_grid_block" USING btree ("_path");
  CREATE INDEX "pages_blocks_testimonials_block_items_order_idx" ON "pages_blocks_testimonials_block_items" USING btree ("_order");
  CREATE INDEX "pages_blocks_testimonials_block_items_parent_id_idx" ON "pages_blocks_testimonials_block_items" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_testimonials_block_order_idx" ON "pages_blocks_testimonials_block" USING btree ("_order");
  CREATE INDEX "pages_blocks_testimonials_block_parent_id_idx" ON "pages_blocks_testimonials_block" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_testimonials_block_path_idx" ON "pages_blocks_testimonials_block" USING btree ("_path");
  CREATE INDEX "pages_blocks_logo_strip_block_logos_order_idx" ON "pages_blocks_logo_strip_block_logos" USING btree ("_order");
  CREATE INDEX "pages_blocks_logo_strip_block_logos_parent_id_idx" ON "pages_blocks_logo_strip_block_logos" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_logo_strip_block_logos_logo_idx" ON "pages_blocks_logo_strip_block_logos" USING btree ("logo_id");
  CREATE INDEX "pages_blocks_logo_strip_block_order_idx" ON "pages_blocks_logo_strip_block" USING btree ("_order");
  CREATE INDEX "pages_blocks_logo_strip_block_parent_id_idx" ON "pages_blocks_logo_strip_block" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_logo_strip_block_path_idx" ON "pages_blocks_logo_strip_block" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_feature_grid_block_items_order_idx" ON "_pages_v_blocks_feature_grid_block_items" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_feature_grid_block_items_parent_id_idx" ON "_pages_v_blocks_feature_grid_block_items" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_feature_grid_block_order_idx" ON "_pages_v_blocks_feature_grid_block" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_feature_grid_block_parent_id_idx" ON "_pages_v_blocks_feature_grid_block" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_feature_grid_block_path_idx" ON "_pages_v_blocks_feature_grid_block" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_testimonials_block_items_order_idx" ON "_pages_v_blocks_testimonials_block_items" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_testimonials_block_items_parent_id_idx" ON "_pages_v_blocks_testimonials_block_items" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_testimonials_block_order_idx" ON "_pages_v_blocks_testimonials_block" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_testimonials_block_parent_id_idx" ON "_pages_v_blocks_testimonials_block" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_testimonials_block_path_idx" ON "_pages_v_blocks_testimonials_block" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_logo_strip_block_logos_order_idx" ON "_pages_v_blocks_logo_strip_block_logos" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_logo_strip_block_logos_parent_id_idx" ON "_pages_v_blocks_logo_strip_block_logos" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_logo_strip_block_logos_logo_idx" ON "_pages_v_blocks_logo_strip_block_logos" USING btree ("logo_id");
  CREATE INDEX "_pages_v_blocks_logo_strip_block_order_idx" ON "_pages_v_blocks_logo_strip_block" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_logo_strip_block_parent_id_idx" ON "_pages_v_blocks_logo_strip_block" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_logo_strip_block_path_idx" ON "_pages_v_blocks_logo_strip_block" USING btree ("_path");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   DROP TABLE "pages_blocks_feature_grid_block_items" CASCADE;
  DROP TABLE "pages_blocks_feature_grid_block" CASCADE;
  DROP TABLE "pages_blocks_testimonials_block_items" CASCADE;
  DROP TABLE "pages_blocks_testimonials_block" CASCADE;
  DROP TABLE "pages_blocks_logo_strip_block_logos" CASCADE;
  DROP TABLE "pages_blocks_logo_strip_block" CASCADE;
  DROP TABLE "_pages_v_blocks_feature_grid_block_items" CASCADE;
  DROP TABLE "_pages_v_blocks_feature_grid_block" CASCADE;
  DROP TABLE "_pages_v_blocks_testimonials_block_items" CASCADE;
  DROP TABLE "_pages_v_blocks_testimonials_block" CASCADE;
  DROP TABLE "_pages_v_blocks_logo_strip_block_logos" CASCADE;
  DROP TABLE "_pages_v_blocks_logo_strip_block" CASCADE;`)
}

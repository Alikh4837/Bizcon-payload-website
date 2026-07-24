import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TABLE "pages_blocks_trusted_by_slider_block_testimonials" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"avatar_id" integer,
  	"quote" varchar,
  	"name" varchar,
  	"company" varchar,
  	"company_logo_id" integer
  );
  
  CREATE TABLE "pages_blocks_trusted_by_slider_block_metrics" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"logo_id" integer,
  	"description" varchar,
  	"growth_text" varchar
  );
  
  CREATE TABLE "pages_blocks_trusted_by_slider_block" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"heading" varchar DEFAULT 'Trusted by the world''s fastest growing companies',
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_trusted_by_slider_block_testimonials" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"avatar_id" integer,
  	"quote" varchar,
  	"name" varchar,
  	"company" varchar,
  	"company_logo_id" integer,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_trusted_by_slider_block_metrics" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"logo_id" integer,
  	"description" varchar,
  	"growth_text" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_trusted_by_slider_block" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"heading" varchar DEFAULT 'Trusted by the world''s fastest growing companies',
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  ALTER TABLE "pages_blocks_trusted_by_slider_block_testimonials" ADD CONSTRAINT "pages_blocks_trusted_by_slider_block_testimonials_avatar_id_media_id_fk" FOREIGN KEY ("avatar_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages_blocks_trusted_by_slider_block_testimonials" ADD CONSTRAINT "pages_blocks_trusted_by_slider_block_testimonials_company_logo_id_media_id_fk" FOREIGN KEY ("company_logo_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages_blocks_trusted_by_slider_block_testimonials" ADD CONSTRAINT "pages_blocks_trusted_by_slider_block_testimonials_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_trusted_by_slider_block"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_trusted_by_slider_block_metrics" ADD CONSTRAINT "pages_blocks_trusted_by_slider_block_metrics_logo_id_media_id_fk" FOREIGN KEY ("logo_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages_blocks_trusted_by_slider_block_metrics" ADD CONSTRAINT "pages_blocks_trusted_by_slider_block_metrics_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_trusted_by_slider_block"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_trusted_by_slider_block" ADD CONSTRAINT "pages_blocks_trusted_by_slider_block_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_trusted_by_slider_block_testimonials" ADD CONSTRAINT "_pages_v_blocks_trusted_by_slider_block_testimonials_avatar_id_media_id_fk" FOREIGN KEY ("avatar_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_trusted_by_slider_block_testimonials" ADD CONSTRAINT "_pages_v_blocks_trusted_by_slider_block_testimonials_company_logo_id_media_id_fk" FOREIGN KEY ("company_logo_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_trusted_by_slider_block_testimonials" ADD CONSTRAINT "_pages_v_blocks_trusted_by_slider_block_testimonials_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_trusted_by_slider_block"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_trusted_by_slider_block_metrics" ADD CONSTRAINT "_pages_v_blocks_trusted_by_slider_block_metrics_logo_id_media_id_fk" FOREIGN KEY ("logo_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_trusted_by_slider_block_metrics" ADD CONSTRAINT "_pages_v_blocks_trusted_by_slider_block_metrics_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_trusted_by_slider_block"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_trusted_by_slider_block" ADD CONSTRAINT "_pages_v_blocks_trusted_by_slider_block_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "pages_blocks_trusted_by_slider_block_testimonials_order_idx" ON "pages_blocks_trusted_by_slider_block_testimonials" USING btree ("_order");
  CREATE INDEX "pages_blocks_trusted_by_slider_block_testimonials_parent_id_idx" ON "pages_blocks_trusted_by_slider_block_testimonials" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_trusted_by_slider_block_testimonials_avatar_idx" ON "pages_blocks_trusted_by_slider_block_testimonials" USING btree ("avatar_id");
  CREATE INDEX "pages_blocks_trusted_by_slider_block_testimonials_compan_idx" ON "pages_blocks_trusted_by_slider_block_testimonials" USING btree ("company_logo_id");
  CREATE INDEX "pages_blocks_trusted_by_slider_block_metrics_order_idx" ON "pages_blocks_trusted_by_slider_block_metrics" USING btree ("_order");
  CREATE INDEX "pages_blocks_trusted_by_slider_block_metrics_parent_id_idx" ON "pages_blocks_trusted_by_slider_block_metrics" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_trusted_by_slider_block_metrics_logo_idx" ON "pages_blocks_trusted_by_slider_block_metrics" USING btree ("logo_id");
  CREATE INDEX "pages_blocks_trusted_by_slider_block_order_idx" ON "pages_blocks_trusted_by_slider_block" USING btree ("_order");
  CREATE INDEX "pages_blocks_trusted_by_slider_block_parent_id_idx" ON "pages_blocks_trusted_by_slider_block" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_trusted_by_slider_block_path_idx" ON "pages_blocks_trusted_by_slider_block" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_trusted_by_slider_block_testimonials_order_idx" ON "_pages_v_blocks_trusted_by_slider_block_testimonials" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_trusted_by_slider_block_testimonials_parent_id_idx" ON "_pages_v_blocks_trusted_by_slider_block_testimonials" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_trusted_by_slider_block_testimonials_ava_idx" ON "_pages_v_blocks_trusted_by_slider_block_testimonials" USING btree ("avatar_id");
  CREATE INDEX "_pages_v_blocks_trusted_by_slider_block_testimonials_com_idx" ON "_pages_v_blocks_trusted_by_slider_block_testimonials" USING btree ("company_logo_id");
  CREATE INDEX "_pages_v_blocks_trusted_by_slider_block_metrics_order_idx" ON "_pages_v_blocks_trusted_by_slider_block_metrics" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_trusted_by_slider_block_metrics_parent_id_idx" ON "_pages_v_blocks_trusted_by_slider_block_metrics" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_trusted_by_slider_block_metrics_logo_idx" ON "_pages_v_blocks_trusted_by_slider_block_metrics" USING btree ("logo_id");
  CREATE INDEX "_pages_v_blocks_trusted_by_slider_block_order_idx" ON "_pages_v_blocks_trusted_by_slider_block" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_trusted_by_slider_block_parent_id_idx" ON "_pages_v_blocks_trusted_by_slider_block" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_trusted_by_slider_block_path_idx" ON "_pages_v_blocks_trusted_by_slider_block" USING btree ("_path");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   DROP TABLE "pages_blocks_trusted_by_slider_block_testimonials" CASCADE;
  DROP TABLE "pages_blocks_trusted_by_slider_block_metrics" CASCADE;
  DROP TABLE "pages_blocks_trusted_by_slider_block" CASCADE;
  DROP TABLE "_pages_v_blocks_trusted_by_slider_block_testimonials" CASCADE;
  DROP TABLE "_pages_v_blocks_trusted_by_slider_block_metrics" CASCADE;
  DROP TABLE "_pages_v_blocks_trusted_by_slider_block" CASCADE;`)
}

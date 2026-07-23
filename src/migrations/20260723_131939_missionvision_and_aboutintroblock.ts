import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TABLE "pages_blocks_about_intro_block_features" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"icon_id" integer,
  	"heading" varchar,
  	"description" varchar
  );
  
  CREATE TABLE "pages_blocks_about_intro_block" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"eyebrow" varchar DEFAULT 'About company',
  	"heading" varchar DEFAULT 'Powerful agency for corporate business.',
  	"description" varchar,
  	"primary_image_id" integer,
  	"secondary_image_id" integer,
  	"cta_text" varchar,
  	"cta_link_label" varchar DEFAULT 'Got a project in mind?',
  	"cta_link" varchar DEFAULT '/contact',
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_mission_vision_block_slides" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"label" varchar,
  	"heading" varchar,
  	"description" varchar,
  	"image_id" integer
  );
  
  CREATE TABLE "pages_blocks_mission_vision_block" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"image_id" integer,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_about_intro_block_features" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"icon_id" integer,
  	"heading" varchar,
  	"description" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_about_intro_block" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"eyebrow" varchar DEFAULT 'About company',
  	"heading" varchar DEFAULT 'Powerful agency for corporate business.',
  	"description" varchar,
  	"primary_image_id" integer,
  	"secondary_image_id" integer,
  	"cta_text" varchar,
  	"cta_link_label" varchar DEFAULT 'Got a project in mind?',
  	"cta_link" varchar DEFAULT '/contact',
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_mission_vision_block_slides" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"label" varchar,
  	"heading" varchar,
  	"description" varchar,
  	"image_id" integer,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_mission_vision_block" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"image_id" integer,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  ALTER TABLE "pages_blocks_about_intro_block_features" ADD CONSTRAINT "pages_blocks_about_intro_block_features_icon_id_media_id_fk" FOREIGN KEY ("icon_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages_blocks_about_intro_block_features" ADD CONSTRAINT "pages_blocks_about_intro_block_features_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_about_intro_block"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_about_intro_block" ADD CONSTRAINT "pages_blocks_about_intro_block_primary_image_id_media_id_fk" FOREIGN KEY ("primary_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages_blocks_about_intro_block" ADD CONSTRAINT "pages_blocks_about_intro_block_secondary_image_id_media_id_fk" FOREIGN KEY ("secondary_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages_blocks_about_intro_block" ADD CONSTRAINT "pages_blocks_about_intro_block_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_mission_vision_block_slides" ADD CONSTRAINT "pages_blocks_mission_vision_block_slides_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages_blocks_mission_vision_block_slides" ADD CONSTRAINT "pages_blocks_mission_vision_block_slides_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_mission_vision_block"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_mission_vision_block" ADD CONSTRAINT "pages_blocks_mission_vision_block_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages_blocks_mission_vision_block" ADD CONSTRAINT "pages_blocks_mission_vision_block_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_about_intro_block_features" ADD CONSTRAINT "_pages_v_blocks_about_intro_block_features_icon_id_media_id_fk" FOREIGN KEY ("icon_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_about_intro_block_features" ADD CONSTRAINT "_pages_v_blocks_about_intro_block_features_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_about_intro_block"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_about_intro_block" ADD CONSTRAINT "_pages_v_blocks_about_intro_block_primary_image_id_media_id_fk" FOREIGN KEY ("primary_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_about_intro_block" ADD CONSTRAINT "_pages_v_blocks_about_intro_block_secondary_image_id_media_id_fk" FOREIGN KEY ("secondary_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_about_intro_block" ADD CONSTRAINT "_pages_v_blocks_about_intro_block_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_mission_vision_block_slides" ADD CONSTRAINT "_pages_v_blocks_mission_vision_block_slides_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_mission_vision_block_slides" ADD CONSTRAINT "_pages_v_blocks_mission_vision_block_slides_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_mission_vision_block"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_mission_vision_block" ADD CONSTRAINT "_pages_v_blocks_mission_vision_block_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_mission_vision_block" ADD CONSTRAINT "_pages_v_blocks_mission_vision_block_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "pages_blocks_about_intro_block_features_order_idx" ON "pages_blocks_about_intro_block_features" USING btree ("_order");
  CREATE INDEX "pages_blocks_about_intro_block_features_parent_id_idx" ON "pages_blocks_about_intro_block_features" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_about_intro_block_features_icon_idx" ON "pages_blocks_about_intro_block_features" USING btree ("icon_id");
  CREATE INDEX "pages_blocks_about_intro_block_order_idx" ON "pages_blocks_about_intro_block" USING btree ("_order");
  CREATE INDEX "pages_blocks_about_intro_block_parent_id_idx" ON "pages_blocks_about_intro_block" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_about_intro_block_path_idx" ON "pages_blocks_about_intro_block" USING btree ("_path");
  CREATE INDEX "pages_blocks_about_intro_block_primary_image_idx" ON "pages_blocks_about_intro_block" USING btree ("primary_image_id");
  CREATE INDEX "pages_blocks_about_intro_block_secondary_image_idx" ON "pages_blocks_about_intro_block" USING btree ("secondary_image_id");
  CREATE INDEX "pages_blocks_mission_vision_block_slides_order_idx" ON "pages_blocks_mission_vision_block_slides" USING btree ("_order");
  CREATE INDEX "pages_blocks_mission_vision_block_slides_parent_id_idx" ON "pages_blocks_mission_vision_block_slides" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_mission_vision_block_slides_image_idx" ON "pages_blocks_mission_vision_block_slides" USING btree ("image_id");
  CREATE INDEX "pages_blocks_mission_vision_block_order_idx" ON "pages_blocks_mission_vision_block" USING btree ("_order");
  CREATE INDEX "pages_blocks_mission_vision_block_parent_id_idx" ON "pages_blocks_mission_vision_block" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_mission_vision_block_path_idx" ON "pages_blocks_mission_vision_block" USING btree ("_path");
  CREATE INDEX "pages_blocks_mission_vision_block_image_idx" ON "pages_blocks_mission_vision_block" USING btree ("image_id");
  CREATE INDEX "_pages_v_blocks_about_intro_block_features_order_idx" ON "_pages_v_blocks_about_intro_block_features" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_about_intro_block_features_parent_id_idx" ON "_pages_v_blocks_about_intro_block_features" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_about_intro_block_features_icon_idx" ON "_pages_v_blocks_about_intro_block_features" USING btree ("icon_id");
  CREATE INDEX "_pages_v_blocks_about_intro_block_order_idx" ON "_pages_v_blocks_about_intro_block" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_about_intro_block_parent_id_idx" ON "_pages_v_blocks_about_intro_block" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_about_intro_block_path_idx" ON "_pages_v_blocks_about_intro_block" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_about_intro_block_primary_image_idx" ON "_pages_v_blocks_about_intro_block" USING btree ("primary_image_id");
  CREATE INDEX "_pages_v_blocks_about_intro_block_secondary_image_idx" ON "_pages_v_blocks_about_intro_block" USING btree ("secondary_image_id");
  CREATE INDEX "_pages_v_blocks_mission_vision_block_slides_order_idx" ON "_pages_v_blocks_mission_vision_block_slides" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_mission_vision_block_slides_parent_id_idx" ON "_pages_v_blocks_mission_vision_block_slides" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_mission_vision_block_slides_image_idx" ON "_pages_v_blocks_mission_vision_block_slides" USING btree ("image_id");
  CREATE INDEX "_pages_v_blocks_mission_vision_block_order_idx" ON "_pages_v_blocks_mission_vision_block" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_mission_vision_block_parent_id_idx" ON "_pages_v_blocks_mission_vision_block" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_mission_vision_block_path_idx" ON "_pages_v_blocks_mission_vision_block" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_mission_vision_block_image_idx" ON "_pages_v_blocks_mission_vision_block" USING btree ("image_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   DROP TABLE "pages_blocks_about_intro_block_features" CASCADE;
  DROP TABLE "pages_blocks_about_intro_block" CASCADE;
  DROP TABLE "pages_blocks_mission_vision_block_slides" CASCADE;
  DROP TABLE "pages_blocks_mission_vision_block" CASCADE;
  DROP TABLE "_pages_v_blocks_about_intro_block_features" CASCADE;
  DROP TABLE "_pages_v_blocks_about_intro_block" CASCADE;
  DROP TABLE "_pages_v_blocks_mission_vision_block_slides" CASCADE;
  DROP TABLE "_pages_v_blocks_mission_vision_block" CASCADE;`)
}

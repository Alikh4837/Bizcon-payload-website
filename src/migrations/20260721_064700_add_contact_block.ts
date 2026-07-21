import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
  CREATE TYPE "public"."enum_pages_blocks_contact_block_contact_details_icon" AS ENUM('mapPin', 'phone', 'mail', 'clock', 'linkedin', 'facebook', 'instagram', 'twitter', 'globe');
  CREATE TYPE "public"."enum__pages_v_blocks_contact_block_contact_details_icon" AS ENUM('mapPin', 'phone', 'mail', 'clock', 'linkedin', 'facebook', 'instagram', 'twitter', 'globe');

  CREATE TABLE "pages_blocks_contact_block_contact_details" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"icon" "enum_pages_blocks_contact_block_contact_details_icon" DEFAULT 'mapPin',
  	"label" varchar,
  	"value" varchar,
  	"link" varchar
  );

  CREATE TABLE "pages_blocks_contact_block" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"eyebrow" varchar DEFAULT 'Get In Touch',
  	"heading" varchar DEFAULT 'Let''s Start a Conversation',
  	"description" varchar DEFAULT 'Have a question about our services or want a quote? Fill out the form and our team will get back to you within one business day.',
  	"map_embed_url" varchar,
  	"form_id" integer,
  	"block_name" varchar
  );

  CREATE TABLE "_pages_v_blocks_contact_block_contact_details" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"icon" "enum__pages_v_blocks_contact_block_contact_details_icon" DEFAULT 'mapPin',
  	"label" varchar,
  	"value" varchar,
  	"link" varchar,
  	"_uuid" varchar
  );

  CREATE TABLE "_pages_v_blocks_contact_block" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"eyebrow" varchar DEFAULT 'Get In Touch',
  	"heading" varchar DEFAULT 'Let''s Start a Conversation',
  	"description" varchar DEFAULT 'Have a question about our services or want a quote? Fill out the form and our team will get back to you within one business day.',
  	"map_embed_url" varchar,
  	"form_id" integer,
  	"_uuid" varchar,
  	"block_name" varchar
  );

  ALTER TABLE "pages_blocks_contact_block_contact_details" ADD CONSTRAINT "pages_blocks_contact_block_contact_details_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_contact_block"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_contact_block" ADD CONSTRAINT "pages_blocks_contact_block_form_id_forms_id_fk" FOREIGN KEY ("form_id") REFERENCES "public"."forms"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages_blocks_contact_block" ADD CONSTRAINT "pages_blocks_contact_block_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_contact_block_contact_details" ADD CONSTRAINT "_pages_v_blocks_contact_block_contact_details_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_contact_block"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_contact_block" ADD CONSTRAINT "_pages_v_blocks_contact_block_form_id_forms_id_fk" FOREIGN KEY ("form_id") REFERENCES "public"."forms"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_contact_block" ADD CONSTRAINT "_pages_v_blocks_contact_block_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;

  CREATE INDEX "pages_blocks_contact_block_contact_details_order_idx" ON "pages_blocks_contact_block_contact_details" USING btree ("_order");
  CREATE INDEX "pages_blocks_contact_block_contact_details_parent_id_idx" ON "pages_blocks_contact_block_contact_details" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_contact_block_order_idx" ON "pages_blocks_contact_block" USING btree ("_order");
  CREATE INDEX "pages_blocks_contact_block_parent_id_idx" ON "pages_blocks_contact_block" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_contact_block_path_idx" ON "pages_blocks_contact_block" USING btree ("_path");
  CREATE INDEX "pages_blocks_contact_block_form_idx" ON "pages_blocks_contact_block" USING btree ("form_id");
  CREATE INDEX "_pages_v_blocks_contact_block_contact_details_order_idx" ON "_pages_v_blocks_contact_block_contact_details" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_contact_block_contact_details_parent_id_idx" ON "_pages_v_blocks_contact_block_contact_details" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_contact_block_order_idx" ON "_pages_v_blocks_contact_block" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_contact_block_parent_id_idx" ON "_pages_v_blocks_contact_block" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_contact_block_path_idx" ON "_pages_v_blocks_contact_block" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_contact_block_form_idx" ON "_pages_v_blocks_contact_block" USING btree ("form_id");
  `)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
  DROP TABLE "pages_blocks_contact_block_contact_details" CASCADE;
  DROP TABLE "pages_blocks_contact_block" CASCADE;
  DROP TABLE "_pages_v_blocks_contact_block_contact_details" CASCADE;
  DROP TABLE "_pages_v_blocks_contact_block" CASCADE;
  DROP TYPE "public"."enum_pages_blocks_contact_block_contact_details_icon";
  DROP TYPE "public"."enum__pages_v_blocks_contact_block_contact_details_icon";
  `)
}
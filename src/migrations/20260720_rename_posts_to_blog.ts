import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
  BEGIN;

  -- 1. Rename the 6 core tables
  ALTER TABLE "posts" RENAME TO "blog";
  ALTER TABLE "posts_populated_authors" RENAME TO "blog_populated_authors";
  ALTER TABLE "posts_rels" RENAME TO "blog_rels";
  ALTER TABLE "_posts_v" RENAME TO "_blog_v";
  ALTER TABLE "_posts_v_rels" RENAME TO "_blog_v_rels";
  ALTER TABLE "_posts_v_version_populated_authors" RENAME TO "_blog_v_version_populated_authors";

  -- 2. Rename the 2 enum types
  ALTER TYPE "enum_posts_status" RENAME TO "enum_blog_status";
  ALTER TYPE "enum__posts_v_version_status" RENAME TO "enum__blog_v_version_status";

  -- 3. Rename FK columns (posts_id -> blog_id) in tables referencing posts/blog
  --    via Payload's polymorphic relationship pattern
  ALTER TABLE "_pages_v_rels" RENAME COLUMN "posts_id" TO "blog_id";
  ALTER TABLE "_blog_v_rels" RENAME COLUMN "posts_id" TO "blog_id";
  ALTER TABLE "footer_rels" RENAME COLUMN "posts_id" TO "blog_id";
  ALTER TABLE "header_rels" RENAME COLUMN "posts_id" TO "blog_id";
  ALTER TABLE "pages_rels" RENAME COLUMN "posts_id" TO "blog_id";
  ALTER TABLE "payload_locked_documents_rels" RENAME COLUMN "posts_id" TO "blog_id";
  ALTER TABLE "blog_rels" RENAME COLUMN "posts_id" TO "blog_id";
  ALTER TABLE "redirects_rels" RENAME COLUMN "posts_id" TO "blog_id";
  ALTER TABLE "search_rels" RENAME COLUMN "posts_id" TO "blog_id";

  -- 4. comments.post_id: no rename needed. Field name stayed "post",
  --    only relationTo changed (posts -> blog).

  COMMIT;
  `)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
  BEGIN;

  -- Reverse of step 3: blog_id -> posts_id
  ALTER TABLE "search_rels" RENAME COLUMN "blog_id" TO "posts_id";
  ALTER TABLE "redirects_rels" RENAME COLUMN "blog_id" TO "posts_id";
  ALTER TABLE "blog_rels" RENAME COLUMN "blog_id" TO "posts_id";
  ALTER TABLE "payload_locked_documents_rels" RENAME COLUMN "blog_id" TO "posts_id";
  ALTER TABLE "pages_rels" RENAME COLUMN "blog_id" TO "posts_id";
  ALTER TABLE "header_rels" RENAME COLUMN "blog_id" TO "posts_id";
  ALTER TABLE "footer_rels" RENAME COLUMN "blog_id" TO "posts_id";
  ALTER TABLE "_blog_v_rels" RENAME COLUMN "blog_id" TO "posts_id";
  ALTER TABLE "_pages_v_rels" RENAME COLUMN "blog_id" TO "posts_id";

  -- Reverse of step 2: enum renames
  ALTER TYPE "enum__blog_v_version_status" RENAME TO "enum__posts_v_version_status";
  ALTER TYPE "enum_blog_status" RENAME TO "enum_posts_status";

  -- Reverse of step 1: table renames
  ALTER TABLE "_blog_v_version_populated_authors" RENAME TO "_posts_v_version_populated_authors";
  ALTER TABLE "_blog_v_rels" RENAME TO "_posts_v_rels";
  ALTER TABLE "_blog_v" RENAME TO "_posts_v";
  ALTER TABLE "blog_rels" RENAME TO "posts_rels";
  ALTER TABLE "blog_populated_authors" RENAME TO "posts_populated_authors";
  ALTER TABLE "blog" RENAME TO "posts";

  COMMIT;
  `)
}

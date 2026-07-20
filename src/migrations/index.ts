import * as migration_20260720_rename_posts_to_blog from './20260720_rename_posts_to_blog';

export const migrations = [
  {
    up: migration_20260720_rename_posts_to_blog.up,
    down: migration_20260720_rename_posts_to_blog.down,
    name: '20260720_rename_posts_to_blog'
  },
];
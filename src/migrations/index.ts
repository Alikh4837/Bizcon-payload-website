import * as migration_20260720_rename_posts_to_blog from './20260720_rename_posts_to_blog';
import * as migration_20260721_064700_add_contact_block from './20260721_064700_add_contact_block';

export const migrations = [
  {
    up: migration_20260720_rename_posts_to_blog.up,
    down: migration_20260720_rename_posts_to_blog.down,
    name: '20260720_rename_posts_to_blog',
  },
  {
    up: migration_20260721_064700_add_contact_block.up,
    down: migration_20260721_064700_add_contact_block.down,
    name: '20260721_064700_add_contact_block'
  },
];

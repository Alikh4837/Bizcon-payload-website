import * as migration_20260720_rename_posts_to_blog from './20260720_rename_posts_to_blog';
import * as migration_20260721_064700_add_contact_block from './20260721_064700_add_contact_block';
import * as migration_20260721_105333_add_team_block from './20260721_105333_add_team_block';
import * as migration_20260721_120719_add_industry_blocks from './20260721_120719_add_industry_blocks';

export const migrations = [
  {
    up: migration_20260720_rename_posts_to_blog.up,
    down: migration_20260720_rename_posts_to_blog.down,
    name: '20260720_rename_posts_to_blog',
  },
  {
    up: migration_20260721_064700_add_contact_block.up,
    down: migration_20260721_064700_add_contact_block.down,
    name: '20260721_064700_add_contact_block',
  },
  {
    up: migration_20260721_105333_add_team_block.up,
    down: migration_20260721_105333_add_team_block.down,
    name: '20260721_105333_add_team_block',
  },
  {
    up: migration_20260721_120719_add_industry_blocks.up,
    down: migration_20260721_120719_add_industry_blocks.down,
    name: '20260721_120719_add_industry_blocks'
  },
];

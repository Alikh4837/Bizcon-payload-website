import * as migration_20260720_rename_posts_to_blog from './20260720_rename_posts_to_blog';
import * as migration_20260721_064700_add_contact_block from './20260721_064700_add_contact_block';
import * as migration_20260721_105333_add_team_block from './20260721_105333_add_team_block';
import * as migration_20260721_120719_add_industry_blocks from './20260721_120719_add_industry_blocks';
import * as migration_20260722_145814_add_trending_and_where_we_serve_blocks from './20260722_145814_add_trending_and_where_we_serve_blocks';
import * as migration_20260722_163716_add_feature_grid_image from './20260722_163716_add_feature_grid_image';
import * as migration_20260723_072543_add_header_cta_button from './20260723_072543_add_header_cta_button';
import * as migration_20260723_075005_add_hero_gallery_images from './20260723_075005_add_hero_gallery_images';
import * as migration_20260723_090941_update_hero_slider_slides from './20260723_090941_update_hero_slider_slides';
import * as migration_20260723_100328_add_trending_card_fields from './20260723_100328_add_trending_card_fields';
import * as migration_20260723_111137_add_services_slider_block from './20260723_111137_add_services_slider_block';
import * as migration_20260723_131939_missionvision_and_aboutintroblock from './20260723_131939_missionvision_and_aboutintroblock';
import * as migration_20260724_070613_add_split_content_block from './20260724_070613_add_split_content_block';
import * as migration_20260724_075523_add_achievement_block from './20260724_075523_add_achievement_block';
import * as migration_20260724_102152_add_process_steps_block from './20260724_102152_add_process_steps_block';
import * as migration_20260724_121452_add_trusted_by_slider_block from './20260724_121452_add_trusted_by_slider_block';
import * as migration_20260724_133742_add_brand_logo_row_block from './20260724_133742_add_brand_logo_row_block';
import * as migration_20260724_145152_merge_trustedby_logos_and_add_trustpilot from './20260724_145152_merge_trustedby_logos_and_add_trustpilot';

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
    name: '20260721_120719_add_industry_blocks',
  },
  {
    up: migration_20260722_145814_add_trending_and_where_we_serve_blocks.up,
    down: migration_20260722_145814_add_trending_and_where_we_serve_blocks.down,
    name: '20260722_145814_add_trending_and_where_we_serve_blocks',
  },
  {
    up: migration_20260722_163716_add_feature_grid_image.up,
    down: migration_20260722_163716_add_feature_grid_image.down,
    name: '20260722_163716_add_feature_grid_image',
  },
  {
    up: migration_20260723_072543_add_header_cta_button.up,
    down: migration_20260723_072543_add_header_cta_button.down,
    name: '20260723_072543_add_header_cta_button',
  },
  {
    up: migration_20260723_075005_add_hero_gallery_images.up,
    down: migration_20260723_075005_add_hero_gallery_images.down,
    name: '20260723_075005_add_hero_gallery_images',
  },
  {
    up: migration_20260723_090941_update_hero_slider_slides.up,
    down: migration_20260723_090941_update_hero_slider_slides.down,
    name: '20260723_090941_update_hero_slider_slides',
  },
  {
    up: migration_20260723_100328_add_trending_card_fields.up,
    down: migration_20260723_100328_add_trending_card_fields.down,
    name: '20260723_100328_add_trending_card_fields',
  },
  {
    up: migration_20260723_111137_add_services_slider_block.up,
    down: migration_20260723_111137_add_services_slider_block.down,
    name: '20260723_111137_add_services_slider_block',
  },
  {
    up: migration_20260723_131939_missionvision_and_aboutintroblock.up,
    down: migration_20260723_131939_missionvision_and_aboutintroblock.down,
    name: '20260723_131939_missionvision_and_aboutintroblock',
  },
  {
    up: migration_20260724_070613_add_split_content_block.up,
    down: migration_20260724_070613_add_split_content_block.down,
    name: '20260724_070613_add_split_content_block',
  },
  {
    up: migration_20260724_075523_add_achievement_block.up,
    down: migration_20260724_075523_add_achievement_block.down,
    name: '20260724_075523_add_achievement_block',
  },
  {
    up: migration_20260724_102152_add_process_steps_block.up,
    down: migration_20260724_102152_add_process_steps_block.down,
    name: '20260724_102152_add_process_steps_block',
  },
  {
    up: migration_20260724_121452_add_trusted_by_slider_block.up,
    down: migration_20260724_121452_add_trusted_by_slider_block.down,
    name: '20260724_121452_add_trusted_by_slider_block',
  },
  {
    up: migration_20260724_133742_add_brand_logo_row_block.up,
    down: migration_20260724_133742_add_brand_logo_row_block.down,
    name: '20260724_133742_add_brand_logo_row_block',
  },
  {
    up: migration_20260724_145152_merge_trustedby_logos_and_add_trustpilot.up,
    down: migration_20260724_145152_merge_trustedby_logos_and_add_trustpilot.down,
    name: '20260724_145152_merge_trustedby_logos_and_add_trustpilot'
  },
];

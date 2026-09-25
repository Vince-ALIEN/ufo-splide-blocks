<?php
/**
 * Plugin Name:       Ufo Splide Blocks
 * Description:       Gutenberg slider blocks powered by Splide.
 * Version:           0.1.8
 * Requires at least: 6.7
 * Requires PHP:      7.4
 * Author:            Vincent LASSERRE
 * Plugin URI:        https://github.com/Vince-ALIEN/ufo-splide-blocks
 * License:           GPL-2.0-or-later
 * License URI:       https://www.gnu.org/licenses/gpl-2.0.html
 * Text Domain:       ufo-splide-blocks
 *
 * @package CreateBlock
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit; // Exit if accessed directly.
}

/**
 * Registers the block using the metadata loaded from the `block.json` file.
 * Behind the scenes, it registers also all assets so they can be enqueued
 * through the block editor in the corresponding context.
 *
 * @see https://developer.wordpress.org/reference/functions/register_block_type/
 */
 function create_block_bc_slideshow_block_init() {
	register_block_type( __DIR__ . '/build/ufo-splide-slider' );
	register_block_type( __DIR__ . '/build/ufo-splide-cpt' );
 }
 add_action( 'init', 'create_block_bc_slideshow_block_init' );

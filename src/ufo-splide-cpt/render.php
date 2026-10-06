<?php
/**
 * @see https://github.com/WordPress/gutenberg/blob/trunk/docs/reference-guides/block-api/block-metadata.md#render
 */

$autoplay          = !empty($attributes['autoplay']);
$navigation        = !empty($attributes['navigation']);
$pagination        = !empty($attributes['pagination']);
$slidesPerView     = !empty($attributes['slidesPerView']) ? $attributes['slidesPerView'] : 1;
$postsToShow       = $attributes['postsToShow'] ?? 5;
$postType          = $attributes['postType'] ?? 'post';
$selectedTaxonomy  = $attributes['selectedTaxonomy'] ?? '';
$selectedTerms     = $attributes['selectedTerms'] ?? [];
$showDate           = $attributes['showDate'] ?? true;
$showCategory       = $attributes['showCategory'] ?? true;
$ctaText            = $attributes['ctaText'] ?? __('En savoir plus', 'ufo-splide-cpt');
$ctaBackgroundColor = $attributes['ctaBackgroundColor'] ?? '';
$ctaTextColor       = $attributes['ctaTextColor'] ?? '';

$cta_style = '';
if ($ctaBackgroundColor) $cta_style .= 'background-color:' . esc_attr($ctaBackgroundColor) . ';';
if ($ctaTextColor)       $cta_style .= 'color:' . esc_attr($ctaTextColor) . ';';

$splide_data = array(
    'slidesPerView' => $slidesPerView,
    'navigation'    => $navigation,
    'pagination'    => $pagination,
    'autoplay'      => $autoplay,
    'postsToShow'   => $postsToShow,
);

$wrapper_attributes = get_block_wrapper_attributes(array(
    'class'                => 'splide',
    'data-splide'          => wp_json_encode($splide_data),
    'role'                 => 'region',
    'aria-label'           => __('Slider de contenus', 'ufo-splide-cpt'),
    'aria-roledescription' => 'carousel',
));

$args = array(
    'post_type'      => $postType,
    'posts_per_page' => $postsToShow,
    'post_status'    => 'publish',
);

if (!empty($selectedTaxonomy) && !empty($selectedTerms)) {
    $args['tax_query'] = array(array(
        'taxonomy' => $selectedTaxonomy,
        'field'    => 'term_id',
        'terms'    => array_map('intval', $selectedTerms),
    ));
}

$posts = get_posts($args);
?>

<div <?php echo $wrapper_attributes; ?>>
  <div class="splide__track my-4 px-4">
    <div class="splide__list">
      <?php foreach ($posts as $post) :
        setup_postdata($post);
        $taxonomy_display = !empty($selectedTaxonomy) ? $selectedTaxonomy : 'category';
        $terms            = wp_get_post_terms($post->ID, $taxonomy_display);
        $categories       = !empty($terms) && !is_wp_error($terms) ? $terms : [];
        $excerpt          = get_the_excerpt($post->ID);
        // Même troncature que la carte du thème (template-parts/content/content.php) si disponible.
        $excerpt          = function_exists('_ufo_truncate_text') ? _ufo_truncate_text($excerpt, 100) : wp_trim_words($excerpt, 20);
      ?>
        <div class="splide__slide">
          <article id="post-<?php echo esc_attr($post->ID); ?>" <?php post_class('relative isolate flex flex-col justify-end overflow-hidden rounded-2xl bg-background px-8 pb-8 min-h-[480px]', $post->ID); ?>>
            <?php if (has_post_thumbnail($post->ID)) : ?>
              <?php
              // wp_get_attachment_image ajoute width/height/srcset/sizes → pas de CLS.
              echo get_the_post_thumbnail(
                  $post->ID,
                  'medium_large',
                  array(
                      'class'   => 'not-prose absolute inset-0 -z-10 w-full h-full object-cover',
                      'alt'     => wp_strip_all_tags(get_the_title($post->ID)),
                      'loading' => 'lazy',
                      'sizes'   => '(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw',
                  )
              );
              ?>
            <?php endif; ?>
            <div class="absolute inset-0 -z-10 bg-linear-to-t from-foreground via-foreground/70"></div>
            <div class="absolute inset-0 -z-10 rounded-2xl ring-1 ring-inset ring-foreground/10"></div>

            <?php if ($showDate || ($showCategory && $categories)) : ?>
              <div class="flex flex-wrap items-center gap-y-1 overflow-hidden text-xs/6 text-white">
                <?php if ($showDate) : ?>
                  <time datetime="<?php echo esc_attr(get_the_date('c', $post->ID)); ?>" class="mr-8">
                    <?php echo esc_html(get_the_date('', $post->ID)); ?>
                  </time>
                <?php endif; ?>
                <?php if ($showCategory && $categories) : ?>
                  <div class="<?php echo $showDate ? '-ml-4 ' : ''; ?>flex flex-wrap items-center gap-x-2 gap-y-1">
                    <?php if ($showDate) : ?>
                      <svg viewBox="0 0 2 2" class="-ml-0.5 size-0.5 flex-none fill-white/50" aria-hidden="true"><circle r="1" cx="1" cy="1" /></svg>
                    <?php endif; ?>
                    <?php foreach ($categories as $category) :
                      /**
                       * Classes CSS du libellé d'un terme (vide par défaut : texte simple).
                       * Permet au thème de styliser chaque terme, ex. un badge coloré.
                       *
                       * @param string  $class      Classes du <span>.
                       * @param WP_Term $category   Terme affiché.
                       * @param WP_Post $post       Publication de la slide.
                       * @param array   $attributes Attributs du bloc.
                       */
                      $term_class = apply_filters('ufo_splide_term_class', '', $category, $post, $attributes);
                    ?>
                      <span<?php if ($term_class) : ?> class="<?php echo esc_attr($term_class); ?>"<?php endif; ?>><?php echo esc_html($category->name); ?></span>
                    <?php endforeach; ?>
                  </div>
                <?php endif; ?>
              </div>
            <?php endif; ?>

            <h2 class="not-prose mt-3 h-12 line-clamp-2 text-lg/6 font-sans font-semibold text-white">
              <?php echo esc_html(get_the_title($post->ID)); ?>
            </h2>
            <p class="not-prose mt-2 px-0 line-clamp-2 text-sm/6 text-white">
              <?php echo esc_html($excerpt); ?>
            </p>
            <a href="<?php echo esc_url(get_permalink($post->ID)); ?>" class="not-prose mt-4 inline-flex w-fit items-center is-style-primary btn bg-primary text-white hover:bg-primary/80 transition-colors duration-300"<?php if ($cta_style) : ?> style="<?php echo esc_attr($cta_style); ?>"<?php endif; ?>>
              <span class="absolute inset-0" aria-hidden="true"></span>
              <?php echo esc_html($ctaText); ?>
            </a>
          </article>
        </div>
      <?php endforeach;
      wp_reset_postdata();
      ?>
    </div>
  </div>
</div>

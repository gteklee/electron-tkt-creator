const $window = $(window);
const $other = $('.other');
const $hidden = $('.section-hidden');

/**
 * When the user selects a menu option update the page
 * based on sections.
 */
$other.on('click', event => {
    let option = event.target;          // Get target that was clicked on.
    let section = $(option).attr('id'); // Get what section to make visible.

    console.log(section);

    if($(option).hasClass('active')) return; // Already selected.

    $('.active').removeClass('active').addClass('other');      // Set option that was active to not.
    $('.section-active').removeClass('section-active').addClass('section-hidden'); // Set previous active section to hidden.

    $('li#'+section).removeClass('other').addClass('active');   // Set option that was not to active.
    $('section#'+section).removeClass('section-hidden').addClass('section-active'); // Show selected section.
});

/**
 * When page loads, make home active option.
 */
$window.on('load', () => {
    $other.first().removeClass('other').addClass('active');
    $hidden.first().removeClass('section-hidden').addClass('section-active');
})
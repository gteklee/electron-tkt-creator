const $window = $(window);
const $other = $('.other');
const $hidden = $('.section-hidden');
const $blur = $('.alert-blur');

let _Section = sessionStorage.section;

/**
 * When the user selects a menu option update the page
 * based on sections.
 */
$other.on('click', event => {
    let option = event.target;          // Get target that was clicked on.
    let section = $(option).attr('id'); // Get what section to make visible.

    if(!sessionStorage.loggedIn)
    {
        $('#err-login').text('Please login before creating tickets!');
        return;
    }
    else if(section === 'option-other') return; // For release with only repair tickets,
                                                                                // and statics ip requests, and...
    if($(option).hasClass('active')) return; // Already selected.

    $('.active').removeClass('active').addClass('other');      // Set option that was active to not.
    $('.section-active').removeClass('section-active').addClass('section-hidden'); // Set previous active section to hidden.

    $('li#'+section).removeClass('other').addClass('active');   // Set option that was not to active.
    $('section#'+section).removeClass('section-hidden').addClass('section-active'); // Show selected section.
    
    redirect(section);
});

/**
 * Redirects html to appropriate section.
 * @param {String} section 
 */
function redirect(section)
{
    if(section === 'option-static' && _Section !== section) {
        sessionStorage.section = section;
        window.location.href = '../html/static.html';
    }
    else if(section === 'option-repair' && _Section !== section) {
        sessionStorage.section = section;
        window.location.href = '../html/index.html';
    }
    else if(section === 'option-install' && _Section !== section) {
        sessionStorage.section = section;
        window.location.href = '../html/install.html';
    }
    else if(section === 'option-onsite' && _Section !== section) {
        sessionStorage.section = section;
        window.location.href = '../html/onsite.html';
    }
    else if(section === 'option-relo' && _Section !== section) {
        sessionStorage.section = section;
        window.location.href = '../html/relo.html';
    }
    else if(section === 'option-key' && _Section !== section) {
        sessionStorage.section = section;
        window.location.href = '../html/key.html';
    }
    else if(section === 'option-voip' && _Section !== section) {
        sessionStorage.section = section;
        window.location.href = '../html/voip.html';
    }
    else if(section === 'option-mtl' && _Section !== section) {
        sessionStorage.section = section;
        window.location.href = '../html/mtl.html';
    }
}

/**
 * When page loads, make home active option.
 */
$window.on('load', () => {

    if(_Section) {
        $('li#'+_Section).removeClass('other').addClass('active');   // Set option that was not to active.
        $('section#'+_Section).removeClass('section-hidden').addClass('section-active'); // Show selected section.
        $blur.hide();
    }
    else {
        $other.first().removeClass('other').addClass('active');
        $hidden.first().removeClass('section-hidden').addClass('section-active');
        $blur.hide();
    }
});

$window.on('beforeunload', () => {
    sessionStorage = undefined;
});
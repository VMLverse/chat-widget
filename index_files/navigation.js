document.addEventListener("DOMContentLoaded", function() {
	var urlAnchorName = window.location.hash.replace('#', ''),
		anchor = $('a[name="'+urlAnchorName+'"]'),
		headerOffset = 100;

	if (urlAnchorName.length && anchor.length) {
		addAnchorOffset(urlAnchorName);

		$('html, body').animate({
			scrollTop: anchor.offset().top
		}, 150, 'swing');
	}

	$('a[href^="#"][href!="#"]').each(function(i,e) {
		var anchorName = $(this).attr('href').replace('#', '');
		if (anchorName.length != 41) {
			addAnchorOffset(anchorName);
		}
	});
	
	function addAnchorOffset(anchorName) {
		$('a[name="'+anchorName+'"]').addClass('page-anchor');
	}
});

var transitionFooter = function() {
	var footer = $('footer');
	var footerHeight = Math.max($('footer > nav.navbar > div').outerHeight(), 100);
	var offset = (window.innerHeight + window.pageYOffset + footerHeight) - document.body.offsetHeight;
	footer.css('height', footerHeight+'px');

	if ((window.innerHeight + window.pageYOffset + footerHeight) >= document.body.offsetHeight) {
		$('footer > nav.navbar').css('top', 'calc(100% - '+offset+'px)');
	} else {
		$('footer > nav.navbar').css('top', 'calc(100% + 150px)');
	}
};

transitionFooter();

$(document).on("ready", function(e){setTimeout(transitionFooter, 0500)});
$(document).on("scroll", function(e){transitionFooter()});
$(window).on("resize", function(e){transitionFooter()});

function onHeightChange(element, callback) {
	var lastHeight = element.clientHeight, newHeight;
	var lastScrollY = window.pageYOffset, newScrollY;

	(function run() {
		newHeight = element.clientHeight;

		if (lastHeight != newHeight)
			callback();

		lastHeight = newHeight;

		if (element.changeTimer)
			clearTimeout(element.changeTimer);

		element.changeTimer = setTimeout(run, 250);
	})();
}

onHeightChange(document.body, function(){transitionFooter()});

var navUtils = {};
$('.bs4 [data-toggle="dropdown"]').each(function(i,e) {
	navUtils[e.id] = new BSN.Dropdown('#'+e.id, true);
});

$('.nav-menu [data-toggle="dropdown"]').each(function(i, el) {
	bindEvent(el.parentNode, 'shown.bs.dropdown', function(event) {
		$('body').addClass('menu-open');
	});

	bindEvent(el.parentNode, 'hidden.bs.dropdown', function(event) {
		$('body').removeClass('menu-open');
	});
});

$('.mobile-navigation-menu').keydown(function(e) {
	if (['ArrowLeft', 'ArrowRight'].includes(e.key)) {
		var idx, navButtons = $('#menuTabs>.tab-button');

		navButtons.each(function(i, el) {
			if ($(this).hasClass('active')) {
				idx = i;
				if (e.key === 'ArrowLeft') {
					idx--;
					if (idx < 0) {
						idx = 2;
					}
				}
				if (e.key === 'ArrowRight') {
					idx++;
					if (idx > 2) {
						idx = 0;
					}
				}
			}
		});

		$(navButtons[idx]).trigger('click').focus();
	}
});

$('#menuTabs>.tab-button').click(function(e) {
	var targetMenu = $(this).data('target'),
		menuOpen = $(this).hasClass('active');

	if (!menuOpen) {
		$('.mobile-navigation-menu .tab-button.active, .mobile-navigation-menu .tab-pane').removeClass('active');
		$(this).addClass('active');
		$('#'+targetMenu).addClass('active');
	}
});

$('.sub-menu-toggle').click(function() {
	var expanded = ($(this).attr('aria-expanded') == 'false') ? true : false;
	$(this).toggleClass('menu-open').attr('aria-expanded', expanded);
	$(this).find('i.fa-chevron-down').toggleClass('fa-chevron-up');
	$('.sub-menu-item.collapse').toggleClass('in');
});

function displayMiniCart() {
	navUtils.shoppingCartDropdown.show();
}

function getMiniCart(cb) {
	var cartContainer = $('.mini-cart-dropdown'),
		cartCount = $('.cart-item-count'),
		itemCount = 0;

	$.get('/ajax/getCartMini.cfm').then(function(template) {
		cartContainer.html(template);
		itemCount = $('.cart-display').data('itemcount');
		cartCount.html((itemCount > 0) ? itemCount : '');
		if (cb) cb();
	});
}

function updateMiniCart() {
	getMiniCart(displayMiniCart);
}


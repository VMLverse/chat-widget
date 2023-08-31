var searchSuggestionsUrl = '/cfc/search/search.cfc?method=getSearchSuggestions',
	searchResultsUrl = '/search/thorsearch.cfm?search=',
	currentSelection = 0;

$('.tl-search').each(function() {
	var _results = $(this).find('.search-results');
	var keywordResults = $(this).find('.keyword-results');
	var partnumberResults = $(this).find('.partnumber-results');
	var keywordSuggestions = _results.find('.keyword-results-list');
	var partnumberSuggestions = _results.find('.partnumber-results-list');
	var viewAllResultsBtn = _results.find('.view-results-btn');

	$(this).find('.tl-search-input').on('input', function(e) {
		var searchTerm = e.target.value;
		
		if (searchTerm.length >= 3) {
			$.ajax({
				type: 'get',
				url: searchSuggestionsUrl,
				data: {
					keyword: searchTerm
				},
				dataType: 'json',
				success: function(r) {
					_results.removeClass('display-results');
					if (r.keywordsTpl.length > 0) {
						keywordSuggestions.html(r.keywordsTpl);
						keywordResults.addClass('display-results');
					} else {
						keywordResults.removeClass('display-results');
					}
					
					if (r.partnumbersTpl.length > 0) {
						partnumberSuggestions.html(r.partnumbersTpl);
						partnumberResults.addClass('display-results');
						viewAllResultsBtn.attr('href', searchResultsUrl+searchTerm);
					} else {
						partnumberResults.removeClass('display-results');
					}
				}
			})
		} else {
			_results.removeClass('display-results');
		}
	});
});

$('form.search-form').submit(function(e) {
	e.preventDefault();
	var searchTerm = $(this).find('input[name="search"]').val() || '';
	location.href = searchResultsUrl+searchTerm;
});

$('.search-form-reset').click(function(event) {
	$('form.search-form input[name="search"]').val('').focus();
});

$('.search-dropdown').keydown(function(e) {
	if (['ArrowUp', 'ArrowDown'].includes(e.key)) {
		if (!$('.search-results .result-link.selected').length) {
			currentSelection = -1;
		}

		if (e.key === 'ArrowUp' && currentSelection > 0) {
			currentSelection--;
		} else if (e.key === 'ArrowDown' && currentSelection != $('.search-results .result-link').length-1) {
			currentSelection++;
		}

		$('.search-results .result-link').removeClass('selected');
		$('.search-results .result-link').eq(currentSelection).addClass('selected').focus();
	}
});

$('.search-partnumber').on('input change', function(e) {
	setTimeout(function() {
		var searchTerm = e.target.value,
			suggestionsContainer = $('.rapid-order-partnumber-suggestions');

		if (searchTerm.length >= 2) {
			$.get('/cfc/search/search.cfc?method=getPartnumberSuggestions&keyword='+searchTerm).then(function(resp) {
				resp = JSON.parse(resp);
				if (resp.partnumbers.length) {
					suggestionsContainer.html(resp.partnumbersTpl).removeClass('hidden');
				} else {
					suggestionsContainer.addClass('hidden').html('');
				}
			});
		} else {
			suggestionsContainer.removeClass('hidden').html('');
		}
	}, 0100);
});

function selectPartnumber(pn) {
	$('input.search-partnumber').val(pn);
	$('.rapid-order-partnumber-suggestions').addClass('hidden').html('');
	$('input[name="quantity"]').focus();
}

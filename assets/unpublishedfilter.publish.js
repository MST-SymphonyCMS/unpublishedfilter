(function($) {


	var Unpublished = function() {
		var fieldNames = ['status', 'published'],
			fieldDates = ['date', 'publish date'],
			fieldToggles = ['yes', 'published', 'activated', 'enabled', 'visible', 'open'],
			fieldId = null,
			fieldDateId = null;

		function init() {
			var table = $('#contents table');

			// Get translations
			$.each(fieldNames, function(index, value) {
				fieldNames.push(translate(value));
			});
			$.each(fieldDates, function(index, value) {
				fieldDates.push(translate(value));
			});
			$.each(fieldToggles, function(index, value) {
				fieldToggles.push(translate(value));
			});

			// Find publish status fields
			table.find('th').each(find);

			// Dim unpublished entries
			table.find('.' + fieldId).each(dim);
		}

		// Find publish status fields
		function find() {
			var text = $.trim($(this).text().toLowerCase());

			if($.inArray(text, fieldNames) > -1) {
				fieldId = this.id;
			}

			// Check for publish date
			if($.inArray(text, fieldDates) > -1) {
				fieldDateId = this.id;
			}
		}

		// Dim unpublished entries
		function dim() {
			var text =  $.trim($(this).text().toLowerCase()),
				published = fieldToggles.some(function(value) {
					if(text.indexOf(value) > -1) {
						return true;
					}
				});

			// Is draft?
			if(published !== true) {
				$(this).parent().addClass('unpublishedfilter-draft');
			}

			// Is future?
			else if(fieldDateId) {
				var date = $(this).parent().find('.' + fieldDateId + ' time');

				// This should be enhanced to also handle multiple dates and date ranges
				if(date.length == 1 && moment(date.attr('datetime')).isAfter()) {
					$(this).addClass('unpublishedfilter-published');
					$(this).parent().addClass('unpublishedfilter-future');
				}
			}
		}

		// Translate string
		function translate(string) {
			term = {};
			term[string] = false;
			Symphony.Language.add(term);
			return Symphony.Language.get(string);
		}

	/*-------------------------------------------------------------------------
		API
	-------------------------------------------------------------------------*/

		return {
			'init': init
		};
	}();

	$(document).on('ready.unpublishedfilter', function() {
		Unpublished.init();
	});
	
})(jQuery.noConflict());

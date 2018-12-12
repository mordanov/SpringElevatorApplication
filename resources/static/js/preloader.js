(function($)
{
	var actions = {
		start: function() {
			//var	$preloader = $("<div id='jpreloader' class='preloader-overlay'><div class='loader' style='position:absolute;left:50%;top:50%;margin-left:-24px;margin-top:-24px;'><svg width='48px' height='48px' xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100' preserveAspectRatio='xMidYMid' class='uil-default'>...</svg></div></div>");
			var	$preloader = $("<div id='jpreloader' class='preloader-overlay'><div class='loader' style='position:absolute;left:50%;top:50%;margin-left:-24px;margin-top:-24px;'><img width='48px' height='48px' th:src='@{/js/preloader.gif}'></img></div></div>");
			$preloader.css({
				'background-color':
				'#4c4c4c',
				'width':
				'100%',
				'height':
				'100%',
				'left':
				'0',
				'top':
				'0',
				'opacity':
				'0.3',
				'z-index':
				'100',
				'position':
				'absolute'
			});
			this.append($preloader);
		},
		stop: function() {
			this.find('.preloader-overlay').remove();
		}
	};
	
	$.fn.preloader = function(action) {
		actions[action].apply(this);
		return this;
	};
	
}(jQuery));

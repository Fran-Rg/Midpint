var $bodyEl;
var $sidedrawerEl;
// ==========================================================================
// Toggle Sidedrawer
// ==========================================================================
function showSidedrawer() {
	// show overlay
	var options = {
		onclose: function() {
			$sidedrawerEl
				.removeClass('active')
				.appendTo(document.body);
		}
	};

	var $overlayEl = $(mui.overlay('on', options));

	// show element
	$sidedrawerEl.appendTo($overlayEl);
	setTimeout(function() {
		$sidedrawerEl.addClass('active');
	}, 20);
}


function hideSidedrawer() {
	$bodyEl.toggleClass('hide-sidedrawer');
}

// ==========================================================================
// Animate menu
// ==========================================================================
var $titleEls = $('strong', $sidedrawerEl);

$titleEls.on('click', function() {
	$(this).next().slideToggle(200);
});

var npinter = 1;
function addPinter()
{
	$( ".pinter-list" ).append( "<form><div class='mui-textfield mui-textfield--float-label'><input id='pstart"+npinter+"' type='text'><label>Pint start "+npinter+"</label></div></form>")
	$("#pstart"+npinter).css('background-color', 'rgba('+Math.floor((Math.random()*255))+','+Math.floor((Math.random()*255))+','+Math.floor((Math.random()*255))+',0.2)');
//	console.log($("#pstart"+npinter).css('background-color'))
	new google.maps.places.Autocomplete((document.getElementById('pstart'+npinter)));
	npinter += 1;
}

function initUI()
{
	$bodyEl = $('body');
	$sidedrawerEl = $('#sidedrawer');
	for(var i=0;i<2;++i)
		addPinter()
	$titleEls
		.next()
		.hide();
	$('.js-show-sidedrawer').on('click', showSidedrawer);
	$('.js-hide-sidedrawer').on('click', hideSidedrawer);
}
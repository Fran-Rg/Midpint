// ==========================================================================
// Toggle Sidedrawer
// ==========================================================================
function showSidedrawer() {
	// show overlay
	var options = {
		onclose: function() {
			$('#sidedrawer')
				.removeClass('active')
				.appendTo(document.body);
		}
	};

	var $overlayEl = $(mui.overlay('on', options));

	// show element
	$('#sidedrawer').appendTo($overlayEl);
	setTimeout(function() {
		$('#sidedrawer').addClass('active');
	}, 20);
}


function hideSidedrawer() {
	$('body').toggleClass('hide-sidedrawer');
}

// ==========================================================================
// Animate menu
// ==========================================================================

$('strong', $('#sidedrawer')).on('click', function() {
	$(this).next().slideToggle(200);
});

var pint_autocompletes = []
function addPinter()
{
	var npinter = pint_autocompletes.length+1;
	var color = [Math.floor(Math.random()*255),Math.floor(Math.random()*255),Math.floor(Math.random()*255)]
	$( ".pinter-list" ).append( "<div class='mui-textfield'><input id='pstart"+npinter+"' class='input-pinter' type='text'><label>Pint start "+npinter+"</label></div>")
	$("#pstart"+npinter).css('background-color', 'rgba('+color[0]+','+color[1]+','+color[2]+',0.2)');
	pint_autocomplete = new google.maps.places.Autocomplete((document.getElementById('pstart'+npinter)));
	pint_autocomplete.color = color;
	pint_autocompletes.push(pint_autocomplete);
}

function initUI()
{
	for(var i=0;i<2;++i)
		addPinter()
	$('strong', $('#sidedrawer'))
		.next()
		.hide();
	$('.js-show-sidedrawer').on('click', showSidedrawer);
	$('.js-hide-sidedrawer').on('click', hideSidedrawer);
	$('.js-add-pinter').on('click', addPinter);
}
// ==========================================================================
// Google Map
// ==========================================================================
var map;
var infoWindow;
var service;
var midpintmarkers = []

function performSearch()
{
	var request = {
		bounds: map.getBounds(),
		keyword: 'pub'
	};
	service.nearbySearch(request, callback);
}

function callback(results, status)
{
	if (status !== google.maps.places.PlacesServiceStatus.OK)
	{
		console.error(status);
		return;
	}
	for (var i = 0, result; result = results[i]; i++)
	{
		addMarker(result);
	}
}

function addMarker(place)
{
	var marker = new google.maps.Marker(
	{
		map: map,
		position: place.geometry.location,
	});
	midpintmarkers.push(marker)

	google.maps.event.addListener(marker, 'click', function()
	{
		service.getDetails(place, function(result, status)
		{
			if (status !== google.maps.places.PlacesServiceStatus.OK)
			{
				console.error(status);
				return;
			}
			infoWindow.setContent('<div><strong>' + result.name + '</strong><br>' + result.vicinity + '</div>');
			infoWindow.open(map, marker);
		});
	});
}

function simulateBounds(points) {

    var bounds = new google.maps.LatLngBounds();

    for (var i = 0; i < points.length; i++)
    {
        bounds.extend(new google.maps.LatLng(points[i]));
    }

    SurOeste = bounds.getSouthWest();
    NorEste = bounds.getNorthEast();

    //Constructs a rectangle from the points at its south-west and north-east corners.
    var latlandBounds = new google.maps.LatLngBounds(SurOeste, NorEste);

    map.fitBounds(latlandBounds);
}

function clearMidMarkers()
{
	for (var i = 0; i < midpintmarkers.length; i++)
	{
		midpintmarkers[i].setMap(null);
	}
	midpintmarkers = []
}



function findAndMarkMidPint(startPoints)
{
	var npoints = startPoints.length;
	console.log("Find from", npoints)
	if (npoints > 1)
	{
		clearMidMarkers();
		hideSidedrawer();
		simulateBounds(startPoints)
		startPoints.forEach(function(p){
			midpintmarkers.push(new google.maps.Marker({
				position: p,
				map: map,
				icon:{
					url: 'http://www.google.com/mapfiles/dd-start.png',
				}
			  })
		  )
		})
		var mid = startPoints.reduce(function(p,c){return {'lat':p['lat']+c['lat'],'lng':p['lng']+c['lng']}},{'lat': 0,'lng': 0});
		mid['lat'] = mid['lat']/npoints;
		mid['lng'] = mid['lng']/npoints;
		request = {
			types: ['bar'],
			location: mid,
			radius:500
		}
		console.log("Mid request:", request)
		var marker = new google.maps.Marker({
			position: mid,
			map: map,
			title: 'Mid Point!',
			icon:{
				url: 'http://maps.gstatic.com/mapfiles/circle.png',
				anchor: new google.maps.Point(10, 10),
				scaledSize: new google.maps.Size(10, 17)
			}
		  });
		midpintmarkers.push(marker)
		map.setCenter(mid)
		function findPintCallback(results, status)
		{
			if (status !== google.maps.places.PlacesServiceStatus.OK)
			{
				console.error("Error to find pub:", status);
				return;
			}
			result = results[0];
			console.log("Mid result:", result)
			addMarker(result);
		}
		service.nearbySearch(request, findPintCallback);
	}
}

function pullStartPints()
{
	spints = pint_autocompletes.map(function(auto){return auto.getPlace()});
	f_spints = spints.filter(function(place){return place && place.geometry});
	location_f_spints = f_spints.map(function(place){return place.geometry.location.toJSON()});
	findAndMarkMidPint(location_f_spints)
}

function initMap()
{
	$('.js-find-mid-pint').on('click', pullStartPints);
	console.log("Init Map")
	map = new google.maps.Map(document.getElementById('map'),
	{
		center:{
			lat: 51.5287718,
			lng: -0.2416803
		},
		zoom: 14,
		mapTypeId: google.maps.MapTypeId.HYBRID,
		mapTypeControl: false,
	});
	infoWindow = new google.maps.InfoWindow();
	service = new google.maps.places.PlacesService(map);

	// The idle event is a debounced event, so we can query & listen without
	// throwing too many requests at the server.
	//
	function testMidPint(){
		findAndMarkMidPint([{
				lat: 51.5287718,
				lng: -0.2416803
			},
			{
				lat: 51.5297725, lng:-0.2527803
			}])
	}
	//testMidPint();
}
var map, markerA, markerB;

var c_lat = 35.643190566853406;
var c_lng = 139.7020945883911;

var sw_lat = 35.6350292365344;
var sw_lng = 139.69149445029302;

var ne_lat = 35.65026998762252;
var ne_lng = 139.71490475297855;

var srcImage = 'http://artspacetokyo.com/images/ast_2/maps/aoyama_meguro-large.png';


$('.collapse').on('click', function(){
	$('#controls').css({
		height: '20px'
	});
});

$('.expand').on('click', function(){
	$('#controls').css({
		height: 'auto'});
});

//Update Image
$('#file-btn').on('click', function(e) {
//	e.preventDefault();
	console.log("asd");
	srcImage = $('#image-url').val();
    //var img = $('<img />', {src : $('#image-url').val()});
    //img.appendTo('body');
    overlay.updateImage(srcImage);
    //return false;
});
//Update Center Point and Bounds;
$('#overlay-btn').on('click', function(){

	c_lat = $('#center-lat').val();
	c_lng = $('#center-lng').val();

	var center = new google.maps.LatLng(c_lat, c_lng);

	map.setCenter(center);

	var bounds = map.getBounds();

	overlay.updateBounds(bounds);
	markerA.setPosition(bounds.getSouthWest());
	markerB.setPosition(bounds.getNorthEast());

});

//Update Input Values;

function updateInputs(){

	$('#image-url').val(srcImage);

	$('#center-lat').val(c_lat);
	$('#center-lng').val(c_lng);

	$('#ne-corner').val( ne_lat +", "+ne_lng );
	$('#sw-corner').val( sw_lat +", "+sw_lng );
}

updateInputs();

    var overlay;
    DebugOverlay.prototype = new google.maps.OverlayView();

    function initialize() {
      var mapOptions = {
        zoom: 15,
        center: new google.maps.LatLng(c_lat, c_lng),
        styles: [
				{
				  featureType: "all",
				  elementType: "all",
				  stylers: [
					{ saturation: -100 } // <-- THIS
				  ]
				}
			]
      };

      map = new google.maps.Map(document.getElementById('map-canvas'), mapOptions);
      var swBound = new google.maps.LatLng(sw_lat, sw_lng);
      var neBound = new google.maps.LatLng(ne_lat, ne_lng);
      var bounds = new google.maps.LatLngBounds(swBound, neBound);




      overlay = new DebugOverlay(bounds, srcImage, map);

      markerA = new google.maps.Marker({
    			position: swBound,
    			map: map,
    			draggable:true
    		});

      markerB = new google.maps.Marker({
    		position: neBound,
    		map: map,
    		draggable:true
    	});

    	google.maps.event.addListener(markerA,'drag',function(){

            var newPointA = markerA.getPosition();
            var newPointB = markerB.getPosition();
            var newBounds =  new google.maps.LatLngBounds(newPointA, newPointB);
           	overlay.updateBounds(newBounds);
        });

      google.maps.event.addListener(markerB,'drag',function(){

          var newPointA = markerA.getPosition();
          var newPointB = markerB.getPosition();
          var newBounds =  new google.maps.LatLngBounds(newPointA, newPointB);
          overlay.updateBounds(newBounds);
      });

        google.maps.event.addListener(markerA, 'dragend', function () {

        	sw_lat = markerA.getPosition().lat();
            sw_lng = markerA.getPosition().lng();
            ne_lat = markerB.getPosition().lat();
            ne_lng = markerB.getPosition().lng();
            updateInputs();
        });

        google.maps.event.addListener(markerB, 'dragend', function () {

	    	sw_lat = markerA.getPosition().lat();
            sw_lng = markerA.getPosition().lng();
            ne_lat = markerB.getPosition().lat();
            ne_lng = markerB.getPosition().lng();
            updateInputs();
        });

        google.maps.event.addListener(map, 'center_changed', function(){
        	c_lat = map.getCenter().lat();
        	c_lng = map.getCenter().lng();
        	updateInputs();
        });

    }

    function DebugOverlay(bounds, image, map) {

      this.bounds_ = bounds;
      this.image_ = image;
      this.map_ = map;
      this.div_ = null;
      this.img_ = null;
      this.setMap(map);
    }

    DebugOverlay.prototype.onAdd = function() {

      var div = document.createElement('div');
      div.style.borderStyle = 'none';
      div.style.borderWidth = '0px';
      div.style.position = 'absolute';
      var img = document.createElement('img');
      img.src = this.image_;
      img.style.width = '100%';
      img.style.height = '100%';
      img.style.opacity = '0.75';
      img.style.position = 'absolute';
      div.appendChild(img);
      this.div_ = div;
      this.img_ = img;
      var panes = this.getPanes();
      panes.overlayLayer.appendChild(div);
    };

    DebugOverlay.prototype.draw = function() {
      var overlayProjection = this.getProjection();
      var sw = overlayProjection.fromLatLngToDivPixel(this.bounds_.getSouthWest());
      var ne = overlayProjection.fromLatLngToDivPixel(this.bounds_.getNorthEast());
      var div = this.div_;
      div.style.left = sw.x + 'px';
      div.style.top = ne.y + 'px';
      div.style.width = (ne.x - sw.x) + 'px';
      div.style.height = (sw.y - ne.y) + 'px';
    };


    DebugOverlay.prototype.updateBounds = function(bounds){
    	this.bounds_ = bounds;
    	this.draw();
    };

    DebugOverlay.prototype.onRemove = function() {
      this.div_.parentNode.removeChild(this.div_);
      this.div_ = null;
    };

    DebugOverlay.prototype.updateImage = function(image){
    	console.log('asdfasfa');
    	this.image_ = image;
    	this.img_.src = this.image_;

    }

    initialize();
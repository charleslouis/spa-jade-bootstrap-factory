'use strict';

// je déclare mes fonctions
function playTheVideoOnClick(idWrapper, posterClass, idVideoAttr){
	// lancement de la video si clic sur button play sur cover image
	$(idWrapper).click(function(){
		var idVideo = $(this).attr(idVideoAttr);
		var videoIframe = '<iframe width="560" height="315" src="//youtube.com/embed/' + idVideo + '?rel=0&amp;showinfo=0&autoplay=1" frameborder="0" allowfullscreen></iframe>';
		$(this).append(videoIframe);
		$(this).find(posterClass).fadeOut();
	});
}

// on document ready ...
$( document ).ready( function() {
	playTheVideoOnClick('#videoWrapper', '.video-poster', 'data-youtube-id');

	document.getElementById('welcome-video').addEventListener('loadedmetadata', function() {
	  this.currentTime = 12;
	}, false);
}); 
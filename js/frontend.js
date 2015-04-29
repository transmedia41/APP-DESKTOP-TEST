$('.pannelClose').click(function() {
console.log('click');

$('footer').hide();

});


/*for each element that is classed as 'pull-down', set its margin-top to the difference between its own height and the height of its parent*/
$('.pull-down').each(function() {
    $(this).css('margin-top', $(this).parent().height()-$(this).height()-25)
});


//Initialisation circle
var influence = $('.circle_1').attr('data-influence');
   $('#circle').circleProgress({
        value: influence,
        size: 80,
        thickness: 9,
        fill: {
            gradient: ["#333"]
        }
    });

   /*
 * Example 2:
 *   - default gradient
 *   - listening to `circle-animation-progress` event and display the animation progress: from 0 to 100%
 */
$('.circle_1').circleProgress({

    size: 80,
    value: influence,
    startAngle: Math.PI /2,
    thickness: 8,
    fill: {
            gradient: ['#9e1915']
        }
}).on('circle-animation-progress', function(event,progress, influence) {
	$(this).find('strong').html('<i>'+parseInt((influence*100))+'%</i>');
/*     $(this).find('strong').html(parseInt(100 * influence) + '<i>%</i>'); */
});



//-- XP Loader
var xp = $('.fill').attr('data-xp');
$('.fill').animate({
    width: xp+"%"
  }, 1000);
  
  



//---Galerie Image
$(function(){$('.imgGD').hide();})


$('.imgThumb').click(function() {
$(".imgGD").toggle();
});


 
/*L.mapbox.accessToken = 'pk.eyJ1IjoidW1lbGVjIiwiYSI6IkxKQW5MSW8ifQ.ve5wCrGM1rSNiyOa27m45g';
L.mapbox.map('map-one', 'mapbox.streets',{
    scrollWheelZoom: false
});*/
  

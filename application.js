//Dominic Cerminara

//Send JSONP Request when submit is clicked
$(function() {
   $('#submit').click(function() {
    var curArtist = $("#artist").val();  
    //reset fields                                 
    $("#error").html("");
    $("#artistinfo").html("");
  	$.getJSON("artistfinder.node.js?aritst" + curArtist, function(result) {
       if(result.error > 1) //if artist entered could not be found
       {
          $("#error").html("The artist you requested could not be found. Please try again.");
       }
       else
       {
      $("#artistinfo").html("<p>Since you like " + $("#artist").val()//Artist name that was typed in
       + ", you should check out <a href='http://"+ result.artist1url //first artist's url
       + "' target='_blank'>" + result.artist1name //first artist's name
       + "</a>, <a href='http://"+ result.artist2url //second artist's url 
       + "' target='_blank'>" + result.artist2name //second artist's name
       + "</a>, and <a href='http://"+ result.artist3url //third artist's url
       + "' target='_blank'>" + result.artist3name //third artist's name 
       + "</a> too!</p>");
       }
    })
  });
});




 var queryURL;
 var track1;
 var Spotifyttrack;
 var player = document.getElementById("player")
 $("#button-1").on("click", function (event) {
     var lyric = $("#lyric-input").val().trim();
     queryURL = "http://api.musixmatch.com/ws/1.1/track.search?apikey=cd0a1c19b692fc8fd0f9825d26856c45&q_lyrics=" + lyric + "&page_size=10";

     $.ajax({
         url: queryURL,
         method: "GET",
         crossDomain: true
     }).done(function (response) {


         var OBJresponse = JSON.parse(response)
         //console.log(OBJresponse)
         // var OBJresponse2 = OBJresponse.message.body.track_list[i].track
         //var artistname = OBJresponse2.artist_name
         //var albumname = OBJresponse2.album_name
         //track1 = OBJresponse2.track_name
         // var imgURL = OBJresponse2.album_coverart_100x100;
         // console.log(track1)
         //  console.log(artistname)
         //  console.log(OBJresponse2)
         for (var i = 0; i < OBJresponse.message.body.track_list.length; i++) {
             console.log(OBJresponse.message.body.track_list[i].track.artist_name)
             var vanity = OBJresponse.message.body.track_list[i].track.commontrack_vanity_id
             var artistname1 = OBJresponse.message.body.track_list[i].track.artist_name
             var songname1 = OBJresponse.message.body.track_list[i].track.track_name
             var song_artist = artistname1 + "+" + songname1;
             var a = $("<button>");

             a.addClass("artistbutton");
             a.text(song_artist);
             a.attr("data-name", song_artist)
             $("#searchresults").append(a);
         }
         $(".artistbutton").on("click", function (event) {
             var songartist2 = $(this).attr("data-name")
             console.log(songartist2)
             //location.assign("player.html")
             queryURL = "https://api.spotify.com/v1/search?q=" + songartist2 + "&type=track"
             $.ajax({
                 url: queryURL,
                 method: "GET",
                 crossDomain: true,
                 headers: {
                     "Authorization": "Bearer BQCeJiwTRav5P2sphMZd4N4jXbJj81xvREqBpBycfZMc6KxPHztvNLX83Y2kqXrvPulH1btRKYdrejG2AXlrf4ir-GaZJEypAyKYkDIUgl8NwTbNE74epLTeF0CHF9vr8IhoXn2LJqAh5w"
                 },
             }).done(function (response) {
                 console.log(vanity)
                 console.log(response)
                 var Spotifyttrack = response.tracks.items["0"].id
                 console.log(Spotifyttrack)
                 $('<iframe/>');
                 $('<iframe/>', {
                     name: 'frame2',
                     id: 'frame2',
                     src: "//www.musixmatch.com/lyrics/" + vanity + "/embed?theme=light"
                 }).appendTo('body');
                 $('<iframe />');
                 $('<iframe />', {
                     name: 'frame1',
                     id: 'frame1',
                     src: "https://open.spotify.com/embed?uri=spotify%3Atrack%3A" + Spotifyttrack + ""
                 }).appendTo("body");
             });
         });
     });
 });

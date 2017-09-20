

$(document).ready(function(){


   AlreadyExists=false;
   AllExistingUsers=[];
   AllExistingUsersTitle=[];
   CurrentUser="";
   GetUser="";

var config=
      {
       apiKey: "AIzaSyD_4SK9aYkug1xi1bByqD37ZeTpLs_Z-Wc",
       authDomain: "lyricmagic-f5a1e.firebaseapp.com",
       databaseURL: "https://lyricmagic-f5a1e.firebaseio.com",
       projectId: "lyricmagic-f5a1e",
       storageBucket: "lyricmagic-f5a1e.appspot.com",
       messagingSenderId: "774077012043"
  
      };
    
     firebase.initializeApp(config);
     db= firebase.database();
     var ref = db.ref("Users");
     ref.on("child_added", gotData,errData);
 
  

     $("#UserLogin").on("click",function(){
      if(CurrentUser!==" ")
       { 
         CurrentUser= $("#exampleInputID").val();
         GetUser=CheckIfUserExists();     

         if(!AlreadyExists)
          {
           var User=db.ref('Users');
            var UserData={
                   Name:CurrentUser
                   
                     };
           User.push(UserData);
           GetUser=CheckIfUserExists();
        
     }   
     }

     
});


function gotData(data)
{
 
  var users=data.val();
  var Titles=JSON.stringify(users);
  var key=data.key;
 

     
             AllExistingUsers.push({[key]:users.Name});
             AllExistingUsersTitle.push({[key]:Titles});
        
      
  
}
function errData()
{
  console.log("An error occured");
}


function CheckIfUserExists()
{
  var UserHistory;

     for(var o=0;o<AllExistingUsers.length;o++)
        {  var _key=Object.keys(AllExistingUsers[o])[0];
             
             if(AllExistingUsers[o][_key]===CurrentUser)
               {   
                AlreadyExists=true;
               if(document.title==="Musi'Called")
                {
                localStorage.setItem('key', _key);
                localStorage.setItem('name', AllExistingUsers[o][_key]);
                localStorage.setItem(_key, AllExistingUsersTitle[o][_key]); 
               
           
                     
                }
                return AllExistingUsers[o];
                break;
               } 
       }    
}

if(document.title==="Player")
{
  var _key=localStorage.getItem("key");
   var UserHistory=localStorage.getItem(_key);
               
                UserHistorySplit=UserHistory.split(',');
                //alert(UserHistorySplit.length);
                for(var e=0;e<UserHistorySplit.length;e++)
                {
                  var removeQ=UserHistorySplit[e].replace(/"/g,""," ");
                  var removeBracksLt=removeQ.replace('{',"");
                  var removeBracksRt=removeBracksLt.replace('}',"");
                  var TwoParts=removeBracksRt.split(":");
                  if(TwoParts[0]!=="Name")
                    $("#topSearches").append("<li>"+TwoParts[0] +" .-. "+TwoParts[1]+"</li>");   
                } 
}

 if(document.title==="Magic'Called")
{
$(".artistbutton").on("click",

function(){

     var _key=localStorage.getItem("key");//Object.keys(GetUser)[0]
     
     var _ref=db.ref("Users/"+_key);

     var strData=localStorage.getItem(_key);

     var splitMe=strData.split(',');
     var glue=" ";
    glue=splitMe[0]+",";
     for(var t=1;t<splitMe.length-1;t++)
     glue=glue+splitMe[t]+",";
     
     
     glue=glue + '"'+$(this).text()+'"'+":"+'"'+$(this).text()+'"';
     glue=glue+","+splitMe[splitMe.length-1];


     _ref.set(JSON.parse(glue));
    

});
}
     

var queryURL;
 var track1;
 var Spotifyttrack;
 $("#button-1").on("click", function (event) {
     var lyric = $("#lyric-input").val().trim();
     queryURL = "http://api.musixmatch.com/ws/1.1/track.search?apikey=cd0a1c19b692fc8fd0f9825d26856c45&q_lyrics=" + lyric + "&page_size=10";

     $.ajax({
         url: queryURL,
         method: "GET",
         crossDomain: true
     }).done(function (response) {


         var OBJresponse = JSON.parse(response)
         console.log(OBJresponse)
         var OBJresponse2 = OBJresponse.message.body.track_list["7"].track
         var artistname = OBJresponse2.artist_name
         var albumname = OBJresponse2.album_name
         track1 = OBJresponse2.track_name
         var imgURL = OBJresponse2.album_coverart_100x100;
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
                 });
                 $('<iframe />');
                 $('<iframe />', {
                     name: 'frame1',
                     id: 'frame1',
                     src: "https://open.spotify.com/embed?uri=spotify%3Atrack%3A" + Spotifyttrack + ""
                 }).appendTo('body');
             });
         });
     });
 });
});//end of documentready

 
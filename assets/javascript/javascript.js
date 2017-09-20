$(document).ready(function () {
    var SpotifyAPI = "BQDPO7mxxTWdB6FquaK9SonDiQckw79hx5q5QjOnAgs5aFrwzX23asMmg5Qjrvnn0HpJ57WzawDki9WdCq1RETbSuFIB-g1TemGMagUF73if4Xy_rag3mmB8-hg5bI8NGvdNaeL1XdDiww";
    var MusixMatchAPI = "cd0a1c19b692fc8fd0f9825d26856c45";
    var FirebaseAPI = "AIzaSyD_4SK9aYkug1xi1bByqD37ZeTpLs_Z-Wc";
    var FirebaseProject = "lyricmagic-f5a1e";
    var FirebaseSenderId = "774077012043";

    function gotData(data) {
        console.log("inside gotData");
        var users = data.val();
        var key = data.key;

        if (CurrentUser === "") {
            AllExistingUsers.push({
                [key]: users
            });
        }
    }

    function CheckIfUserExists() {
        for (var o = 0; o < AllExistingUsers.length; o++) {
            console.log(AllExistingUsers[o]);
            if (AllExistingUsers[o].Name == CurrentUser) {
                AlreadyExists = true;
                return AllExistingUsers[o];
                break;
            }
        }
    }

    function errData() {
        console.log("An error occured");
    }

    var config = {
        apiKey: FirebaseAPI,
        authDomain: FirebaseProject + ".firebaseapp.com",
        databaseURL: "https://" + FirebaseProject + ".firebaseio.com",
        projectId: FirebaseProject,
        storageBucket: FirebaseProject + ".appspot.com",
        messagingSenderId: FirebaseSenderId

    };
    var AlreadyExists = false;
    var AllExistingUsers = [];
    var CurrentUser = "";
    var GetUser = "";
    firebase.initializeApp(config);
    var db = firebase.database();
    var ref = db.ref("Users");
    ref.on("child_added", gotData, errData);

    $("#UserLogin").on("click", function () {
        CurrentUser = $("#AName").val();
        GetUser = CheckIfUserExists();
        if (!AlreadyExists) {
            var User = db.ref('Users');
            var UserData = {
                Name: CurrentUser,
                SearchText: ''
            }
            User.push(UserData);
        }
    });

    //Generates a Track button
    function createTrack(track) {
        var a = $("<button class='artistbutton'/>");
        a.text(track.artist_name + " - " + track.track_name);
        a.attr("data-artist", track.artist_name);
        a.attr("data-track", track.track_name);
        a.attr("data-vanity", track.commontrack_vanity_id);
        return a;
    }

    //Setup future AJAX requests with Spotify Auth header
    $.ajaxSetup({
        headers: {
            Authorization: "Bearer " + SpotifyAPI
        }
    });

    //Set up all future artist buttons to allow play
    $(".container").on("click", ".artistbutton", function (event) {
        var artist = $(this).attr("data-artist");
        var track = $(this).attr("data-track");
        var vanity = $(this).attr("data-vanity");
        var trackObj = {
            artist_name: artist,
            track_name: track,
            commontrack_vanity_id: vanity
        };

        //Get Spotify track ID from artist and track info and setup player
        var query = "artist:" + artist + " track:" + track;
        $.getJSON("https://api.spotify.com/v1/search", {
            q: query,
            type: "track",
            limit: 1
        }, play);

        //Create Lyrics panel from musixmatch vanity string
        var iframe = $('<iframe/>', {
            name: 'lyrics',
            id: 'lyricsIFrame',
            height: 450,
            width: "100%",
            src: "//www.musixmatch.com/lyrics/" + vanity + "/embed?theme=light"
        });
        $('#lyricsPanel').html(iframe);

        //Check if it exists in top searches
        var button = $('#topSearches .artistbutton[data-vanity="' + vanity + '"]');
        if (button.length === 0) { //If it doesn't exist, make a copy
            button = createTrack(trackObj);
            //Insert Firebase code to add to Database here using artist, track, and vanity
        }

        $("#topSearches").prepend(button); //Add to top of searches
        $("#topSearches button:gt(9)").remove(); //Delete extra buttons
    });

    function play(response) {
        console.log(response.tracks.href);
        console.log(response.tracks);
        var trackId = response.tracks.items[0].id;
        var iframe = $('<iframe />', {
            name: 'spotify',
            id: 'playerIFrame',
            height: 450,
            width: "100%",
            src: "https://open.spotify.com/embed?uri=spotify:track:" + trackId
        });
        $('#player').html(iframe);
    }

    //Set up search functions
    $("#searchLyrics").click(search);
    $("#lyrics").keypress(function (e) {
        if (e.which == 13) { //User pressed enter
            search();
        }
    });

    function search() {
        var lyrics = $("#lyrics").val().trim();
        if (lyrics)
            $.getJSON("http://api.musixmatch.com/ws/1.1/track.search", {
                apikey: MusixMatchAPI,
                q_lyrics: lyrics,
                page_size: 10
            }, handleMusix);
    }

    function handleMusix(response) {
        var data = response.message;
        $("#searchResults").toggleClass('bg-danger', data.header.status_code !== 200);

        //Show error if problem with request
        if (data.header.status_code !== 200) {
            $("#searchResults").html('Error ' + data.header.status_code + ' while fetching search results.');
            return;
        }

        var tracks = data.body.track_list;
        $("#searchResults").empty(); //Clear previous results
        if (tracks.length === 0)
            $("#searchResults").html('No results found for "' + $("#lyrics").val().trim() + '".')

        //Create button list of results
        for (var i = 0; i < tracks.length; i++) {
            var track = tracks[i].track;
            //console.log(track);
            $("#searchResults").append(createTrack(track));
        }
    }
});

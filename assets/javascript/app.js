var animalList = ["cats", "dogs", "birds", "fish", "monkeys", "chicken", "pandas", "cranes", "tigers", "mantis", "snakes", "turtles", "mooses", "owls", "lizards", "alpacas", "beavers", "bears"]
function generatebutton() {
    for (var i = 0; i < animalList.length; i++) {
        $(".gif-buttons-default").append("<button type='submit' class='newbutton-js' data-name='" + animalList[i] + "'>" + animalList[i] + "</button> ");
    }
}
generatebutton();

//////////////////////////////
//click navbar to reload page:
//////////////////////////////
$(".gif-header").on("click", function () {
    location.reload();
})

////////////////////////////////////////////////////
//click submit button of input to create new button:
////////////////////////////////////////////////////
$("#gif-submit").on("click", function () {
    event.preventDefault();

    var newAnimal = $(".gif-input").val().trim();
    if (newAnimal.length !== 0) {
        animalList.push(newAnimal);
    } else {
        alert("Don't you wanna add an animeow~ ??")
    }
    // clear the input content
    $(".gif-input").val("");

    // clear list before reloop
    $(".gif-buttons-default").empty();
    generatebutton();
    favoritePagebutton = $(".gif-buttons-default").prepend("<button type='submit' class='favpageButton-js'> My Favorites </button> ");
})

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//click animal button from list, then generate more-gif-button, 10 gifs, rating, and favorite button into the EMPTY BOX:
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

// set loading img (from local)
// var img = $("<img>");
// img.attr("src", "assets/images/anigif-r.gif");

// DO NOT var apiLimit=10 into function, or it won't reload when click more-gif-button. Make apiLimit as universal.
var apiLimit = 10;

$(document).on("click", ".newbutton-js", function () {
    $(".gif-show").empty();
    buttonText = $(this).attr("data-name");
    var queryURL = "https://api.giphy.com/v1/gifs/search?q=animal+" + buttonText + "&api_key=MrCk33YTz6WfMMgxax4KaDxkCzsj5oVU&limit=" + apiLimit.toString();
    console.log(queryURL)
    $.ajax({
        url: queryURL,
        method: "GET"
    }).then(function (response) {
        for (var i = 0; i < response.data.length; i++) {
            if (response.data[i].rating !== "r") {
                // 1. create <div>, and every <div> will hold every pair of gif, rating, and star button:
                var gifHolder = $("<div>").addClass("rate-and-gif");

                // 2. append <img> of GIF when click button
                var img = $("<img>");
                img.addClass("newgif-js");
                img.attr({ "src": response.data[i].images.fixed_height_still.url, "data-still": response.data[i].images.fixed_height_still.url, "data-animate": response.data[i].images.fixed_height.url, "data-state": "still" });
                // approach 1: Set multiple attributes in an object(easier).
                // approach 2: Set multiple attributes one by one:
                // img.attr("src", response.data[i].images.fixed_height_still.url);
                // img.attr("data-still", response.data[i].images.fixed_height_still.url);
                // img.attr("data-animate", response.data[i].images.fixed_height.url);
                // img.attr("data-state", "still");
                gifHolder.append(img);

                // 3. append <p> of RATING when click button
                gifHolder.append("<p class='newrating-js'>" + buttonText + " / Rating: " + response.data[i].rating.toUpperCase() + "</p>");

                // 4. append <i> of STAR Symbol (favorite)
                var favStar = '<i class="fas fa-star favme"></i>'
                gifHolder.append(favStar)

                // 5. show gif, rating, and star button in empty box
                $(".gif-show").prepend(gifHolder)
            }
        }
        //6. generate a More Button at the top of box (put it out of loop, javascript will read brackets from outside to inside)
        var moreGifButton = '<button class="more-gif-button"><i class="fas fa-caret-square-down"></i></button>'
        $(".gif-show").append(moreGifButton);
    })
})

/////////////////////////////////////////////////////////
//click more-gif-button, and prepend 10 more gifs at top:
/////////////////////////////////////////////////////////
$(document).on("click", ".more-gif-button", function () {
    $(".gif-show").empty();
    apiLimit += 10;
    queryURL = "https://api.giphy.com/v1/gifs/search?q=animal+" + buttonText + "&api_key=MrCk33YTz6WfMMgxax4KaDxkCzsj5oVU&limit=" + apiLimit.toString();
    // buttonText will load from line48
    console.log(apiLimit)
    console.log(queryURL)
    console.log(buttonText);

    $.ajax({
        url: queryURL,
        method: "GET"
    }).then(function (response) {
        for (var i = 0; i < response.data.length; i++) {
            if (response.data[i].rating !== "r" && response.data[i].rating !== "pg-13") {
                var gifHolder = $("<div>").addClass("rate-and-gif");
                var gifstill = response.data[i].images.fixed_height_still.url;
                var gifstart = response.data[i].images.fixed_height.url;
                gifHolder.append("<img src='" + gifstill + "' data-still='" + gifstill + "' data-animate='" + gifstart + "' data-state='still' class='newgif-js'>");
                gifHolder.append("<p class='newrating-js'>" + buttonText + " / Rating: " + response.data[i].rating.toUpperCase() + "</p>");
                var favStar = '<i class="fas fa-star favme"></i>'
                gifHolder.append(favStar)
                $(".gif-show").prepend(gifHolder)
            }
        }
        var moreGifButton = '<button class="more-gif-button"><i class="fas fa-caret-square-down"></i></button>'
        $(".gif-show").append(moreGifButton);
    })
})//---------more-gif-button end-----------

//////////////////////////////////////////////////////
//click gif to still or animate, inside the EMPTY BOX:
//////////////////////////////////////////////////////
$(document).on("click", ".newgif-js", function () {
    if ($(this).attr("data-state") === "still") {
        $(this).attr("src", $(this).attr("data-animate"));
        $(this).attr("data-state", "animate");
    } else {
        $(this).attr("src", $(this).attr("data-still"));
        $(this).attr("data-state", "still");
    }
});

//////////////////////////////////////////////
//click favorite button, inside the EMPTY BOX:
//////////////////////////////////////////////
$(document).on("click", ".favme", function () {
    $(this).toggleClass('star-color', function () {
        // localStorage.setItem("favorite", JSON.stringify());

    });
});

// favorite button and page
var favoritePagebutton = $(".gif-buttons-default").prepend("<button class='favpageButton-js'>&bigstar; All My Favorites </button>")
$(".favpageButton-js").on("click", function () {
    $(".gif-show").empty();
    $(".gif-show").append('<span class="guide-word">Hmm, I cannot find any favorite gifs...</span><img src="assets/images/anigif.gif" class="gif-background" alt="gif">')
})
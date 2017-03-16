$(document).ready(function() {

    // caching jQuery elements
    var $imageDisplay = $('#imageDisplay');
    var $reactionInput = $('#reaction-input');
    var $btnList = $('#btnList');
    var $addReaction = $('#add-reaction');
    var $saveBtn = $('#saveBtn');
    var $loadBtn = $('#loadBtn');

    var reactionButtons = ['Shock', 'Awe', 'Angry', 'Happy', 'Surprise', 'Scared', 'Excited', 'Bored'];

    var reactionClick = function(reaction) {
        var reactionLbl = $(this).attr("data-reaction");
        var offsetRand = 10 * Math.floor(Math.random() * 100);

        $('.reactBtn').each(function(){
          $(this).removeClass('btn-info');
        });

        $(this).toggleClass('btn-info');

        var queryURL = "http://api.giphy.com/v1/gifs/search?q=" + reactionLbl + "&api_key=dc6zaTOxFJmzC&limit=10&offset=" + offsetRand;

        console.log(queryURL);

        $.ajax({
                url: queryURL,
                method: "GET"
            })
            .done(function(response) {
                var results = response.data;

                $imageDisplay.empty();
                console.log(results[1])
                for (var i = 0; i < results.length; i++) {
                    var gifDiv = $('<div>');

                    var rating = results[i].rating;

                    var p = $('<p>').text('Rating: ' + rating);

                    var reactionImage = $('<img>');

                    reactionImage.attr('src', results[i].images.original_still.url);
                    reactionImage.addClass('gifs');
                    reactionImage.attr('data-still', results[i].images.original_still.url);
                    reactionImage.attr('data-animate', results[i].images.original.url);
                    reactionImage.attr('data-state', 'still');
                    reactionImage.attr('alt', reactionLbl + " Gif");
                    gifDiv.prepend(p);
                    gifDiv.append(reactionImage);

                    gifDiv.addClass('col-sm-6');

                    $imageDisplay.prepend(gifDiv);
                }
            });
    }

    var gifClick = function(gif) {
        var state = $(this).attr('data-state');

        if (state == 'still') {
            $(this).attr('src', $(this).attr('data-animate'));
            $(this).attr('data-state', 'animate');
        } else {
            $(this).attr('src', $(this).attr('data-still'));
            $(this).attr('data-state', 'still');
        }

    }

    var removeBtn = function(button) {
        var reactionName = $(this).attr("data-reaction");
        var index = reactionButtons.indexOf(reactionName);

        if (index > -1) {
            reactionButtons.splice(index, 1);
        }

        console.log(reactionButtons);

        $(this).parent().remove();

    }

    var renderButtons = function() {
        $btnList.empty();
        for (var i = 0; i < reactionButtons.length; i++) {
            var div = $('<div>');
            var btn = $("<button>");
            var x = $('<button>');
            x.text('x');
            x.addClass('btn btn-outline-danger xBtn');
            x.attr("data-reaction", reactionButtons[i]);
            btn.addClass("btn btn-lg btn-primary reactBtn");
            btn.attr("data-reaction", reactionButtons[i]);
            btn.text(reactionButtons[i]);
            div.append(x);
            div.append(btn);
            $btnList.append(div);

        }
    }

    $(document).on("click", ".xBtn", removeBtn);

    $(document).on("click", ".reactBtn", reactionClick);

    $(document).on("click", ".gifs", gifClick);

    $addReaction.on("click", function(event) {
        event.preventDefault();

        var reaction = $reactionInput.val().trim();
        console.log(reaction);
        if (reaction !== "") {
            reactionButtons.push(reaction);
        }
        console.log(reactionButtons);
        $reactionInput.val('');
        renderButtons();
    });



    renderButtons();
});

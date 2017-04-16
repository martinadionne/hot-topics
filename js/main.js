/*global $, console, alert, confirm, prompt*/
$(document).ready(function () {
    "use strict";
    var contents, url, fm, nm, em, cm, sb, errors, dt, data, collect;
    
    // storage for contents
    contents = {};
    /*
    Load the first content by default
    (on the page load): */
    $(".bg-main .box").load("./partials/partial-1.html", function (response) {
        contents["./partials/partial-1.html"] = response;
    });
    // handle success - server responds
    function handleResponse(response) {
        // print the response inside <div class="feedback"></div>
        $(".feedback").html(response).hide().fadeIn(500);
    }
    // find out the error
    function handleError(jqXHR, textStatus, errorThrown) {
        console.log("textStatus: " + textStatus + "\n" + "errorThrown: " + errorThrown);
    }

    function validateForm(ev) {
        collect = 'Please fix the following errors: ';
        // prevents submitting form
        ev.preventDefault();
        fm = document.querySelector("form");
        nm = $("#name");
        em = $("#email");
        sb = $("#subject");
        cm = $("#comment");
        // start with empty "buckets"
        errors = [];
        dt = {};
        //check name
        if (nm.val() === "") {
            errors.push("<p>Please enter a name.</p>");
        }
        else {
            dt.name = nm.val();
        }
        //check email
        if (em.val() === "") {
            errors.push("<p>Please enter an email.</p>");
        }
        else if (!(/\S+@\S+\.\S+/.test(em.val()))) {
            errors.push("<p>Please enter a valid email.</p>");
        }
        else {
            // use regular expression to check format
            dt.email = em.val();
        }
        // check subject
        if (sb.val() === "") {
            errors.push("<p>Please enter a subject.</p>");
        }
        else {
            dt.subject = sb.val();
        }
        // check comments
        if (cm.val() === "") {
            errors.push("<p>Please enter a comment.</p>");
        }
        else {
            dt.subject = cm.val();
        }
        //if there are no errors
        if (errors.length === 0) {
            collect = '';
            $(".feedback").html(collect);
            nm.val("");
            em.val("");
            sb.val("");
            cm.val("");
            // handle ajax request
            $.ajax({
                type: "post"
                , url: "./server-side-script/web-service.php"
                , data: dt
                , dataType: "text"
            }).done(handleResponse).fail(handleError);
        }
        else {
            // print your errors in JavaScript console
            collect = collect+' <ul>';
            for(var i=0; i < errors.length; i++){
                collect = collect+' <li class="error">'+errors[i]+'</li>';
            }
            collect = collect+' </ul>';
             $(".feedback").html(collect);
        }
    }

    function storeContents(urlParam) {
        // if content already exists inside contents
        if (contents[urlParam]) {
            // load the content from contents
            $(".bg-main .box").html(contents[urlParam]);
            //console.log("Loaded from array!");
        }
        else {
            // load the content by ajax request
            $(".bg-main .box").load(urlParam, function (pageRsp) {
                contents[urlParam] = pageRsp;
                //console.log("Loaded by ajax request!");
            });
        }
    }
    // what happens when link is clicked
    $(".navbar a").on("click", function (ev) {
        ev.preventDefault();
        url = $(this).attr("href");
        /*
        // test
        console.log(url); */
        storeContents(url);
        $(".bg-main .box").on("submit", "form", validateForm);
    });
});
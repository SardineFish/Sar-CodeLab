const $ = selector => document.querySelector(selector);
const $$ = selector => document.querySelectorAll(selector);
window.onload = function ()
{
    HTMLTemplate.Init();
    var request = new XMLHttpRequest();
    request.open("GET", "/lab-data.json");
    request.onreadystatechange = function ()
    {
        if (request.readyState != 4)
            return;
        var data = JSON.parse(request.responseText);
        $("#item-template").dataSource = data;
        document.querySelectorAll("a").forEach(function (element)
        {
            element.addEventListener("click", function (e)
            {
                //e.preventDefault();
                var link = e.currentTarget;
                var url = link.href;
                var name = link.querySelector(".name").innerText;
                //history.pushState(null, name, url);
            });
        });
    };
    request.send();
};
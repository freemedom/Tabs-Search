console.log("tabz-contetnt.js loaded");

function getDetails(){
  var linksList = document.querySelectorAll('a');
  var links = [];

  linksList.forEach(
    function(currentValue, currentIndex, listObj) {
      links.push({"text": currentValue.innerText.trim(), "href": currentValue.href});
    },
    'myThisArg'
  );

  return {
      "tab_id": tab_id || -1,
      "title": document.title,
      "url": window.location.href,
      "text": document.body.innerText,//document.all[0].innerText,
      "links": links
    };
}

getDetails();

console.log('in script.js');

$(document).ready(function(){
  console.log('in jquery.min.js');
  $('#testBtn').on('click', function(){
    console.log('testBtn clicked');
    // assemble ann object (always for a post call)
    var objectToSend = {
      username: "username"
    }; // end objectToSend

    // send object to postRoute via ajax
    $.ajax({
      type: 'post',
      url: '/postRoute',
      data: objectToSend
    }); // end ajax
  }); // end testBtn
});

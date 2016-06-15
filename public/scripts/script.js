console.log( 'script.js sourced' );

$( document ).ready( function(){
  console.log( 'jQuery here!!!' );
  $( '#addButton' ).on( 'click', function(){
    console.log( 'add button clicked' );
    // get username from input
    var newUserName = $( '#usernameIn' ).val();
    // create object to post
    var newUser={
      "username": newUserName,
      "active": true
    };// end object
    // send object to server as a post
    $.ajax({
      type: 'POST',
      url: '/createNew',
      data: newUser
    }); // end ajax
  }); // end addbutton
}); // end jQuery

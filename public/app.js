$(document).ready(function() {
    //handle comment form submission
    $('form').on('submit', function(event) {
      event.preventDefault();
      $(this).children('div').children('.name-error').hide();
      $(this).children('div').find('.body-error').hide();
      let isValid = true;
      const name = $(this).children('div.row-top').children('div').children('input.name').val().trim();
      const body = $(this).children('div.row-bottom').children('div').children('textarea.comment').val().trim();
      if (name === '') {
        $(this).children('div.row-top').children('div').children('.name-error').show();
        isValid = false;
      }
      if (body === '') {
        $(this).children('div').find('.body-error').show();
        isValid = false;
      }
      if (isValid) {
        $.ajax({
          url: '/articles/' + $(this).attr('id'),
          method: 'PUT',
          data: {
            name: name,
            body: body
          }
        }).then(function(result) {
          console.log(result);
          window.location.reload();
        }).catch(function(error) {
          console.log(error);
        });
      }
    });
  
    $('#refresh').on('click', function() {
      window.location.href = '/'; 
    });
  }); 
$(() => {
  
  let bOnHomePage = true;

  handleBrowseClicked = () => {
    $('.begin-js').click(e => {
      toggleHide('.intro');
      toggleHide('.content');
      bOnHomePage = false;
    });
  };

  handleHomeClicked = () => {
    $('#brand').click(e => {
      if (!bOnHomePage) {
        toggleHide('.intro');
        toggleHide('.content');
        bOnHomePage = true;
      }
    });
  };
  
  handleFormSubmit = () => {
    $('form').submit(e => {
      e.preventDefault();
      $('#results-js').empty();
    })
  }

  toggleHide = target => {
    $(target).toggleClass('hide');
  }

  handleBrowseClicked();
  handleHomeClicked();
  handleFormSubmit();
  
  //for testing
  toggleHide('.intro');
  toggleHide('.content');
  bOnHomePage = false;
})
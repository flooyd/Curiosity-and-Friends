$(() => {
  let bOnHomePage = true;

  handleBrowseClicked = () => {
    $('.begin-js').click(e => {
      toggleHide('.intro');
      toggleHide('.favorite-js');
      bOnHomePage = false;
    });
  };

  handleHomeClicked = () => {
    $('h3 a').click(e => {
      if (!bOnHomePage) {
        toggleHide('.intro');
        toggleHide('.favorite-js');
        bOnHomePage = true;
      }
    });
  };

  toggleHide = target => {
    $(target).toggleClass('hide');
  }

  handleBrowseClicked();
  handleHomeClicked();
})
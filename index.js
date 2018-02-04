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
    $('h3 a').click(e => {
      if (!bOnHomePage) {
        toggleHide('.intro');
        toggleHide('.content');
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
$(() => {
  
  let bOnHomePage = true;
  const rovers =[{
    rover: 'Curiosity',
    cameras: [0, 1, 2, 3, 4, 5, 6]
  }, {
    rover: 'Opportunity',
    cameras: [0, 1, 6, 7, 8]
  }, {
    rover: 'Spirit',
    cameras: [0, 1, 6, 7, 8],
    landing_date: "2004-01-04",
    launch_date: "2003-06-10",
    status: "complete",
    max_date: '2010-03-21',
    total_photos: '124550'
  }];
  
  let cameras = [
    'FHAZ-Front Hazard Avoidance Camera',
    'RHAZ-Rear Hazard Avoidance Camera',
    'MAST-Mast Camera',
    'CHEMCAM-Chemistry and Camera Complex',
    'MAHLI-Mars Hand Lens Imager',
    'MARDI-Mars Descent Imager',
    'NAVCAM-Navigation Camera',
    'PANCAM-Panoramic Camera',
    'MINITES-Miniature Thermal Emission Spectrometer'];
    
  getURI = () => {
    let date = $('#date').val();
    let rover = $('#rover').val();
    return `https://api.nasa.gov/mars-photos/api/v1/rovers/${rover}/photos?earth_date=${date}&api_key=Pe0cgsEjq6AGXZFT2GkmM4nzQAAgbRrB3c9qXke3`
  }
  
  getImages = URI => {
    console.log(URI)
    $.getJSON(URI, data => {
      renderImages(data.photos);
    }).fail(() => {
      console.log('fail');
    })
  }
  
  renderImages = images => {
    images.forEach(i => {
      $('#results-js').append(
        `<div class="col-3">
        <div class="container">
        <img class="marsImg" src="${i.img_src}">
        <p>Hello </p>
        </div>
        </div>`
        );
    })
  }
  
  getManifests = () => {
    
  }
  
  setCameraOptions = rover => {
    $('#camera').empty();
    rover = rovers.find(r => r.rover === rover);
    rover.cameras.forEach(c => {
      let camera = cameras[c].split('-')[1];
      $('#camera').append($("<option>").val(camera).html(camera));
    })
  }
  
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
      $('form button').prop('disabled', true);
      getImages(getURI());
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
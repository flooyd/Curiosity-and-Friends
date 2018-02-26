$(() => {

  //temp storage for photos to be used to retrieve info if a photo is favorited
  let photos = [];
  let bOnHomePage = true;
  const rovers = [{
    rover: 'Curiosity',
    img_src: 'images/curiosity.jpg',
    cameras: [0, 1, 2, 3, 4, 5, 6],
  }, {
    rover: 'Opportunity',
    img_src: 'images/opportunity.jpg',
    cameras: [0, 1, 6, 7, 8]
  }, {
    //I don't query API for this because the Rover's mission is complete. She's stuck in soil on Mars! :(
    rover: 'Spirit',
    img_src: 'images/spirit.jpg',
    cameras: [0, 1, 6, 7, 8],
    landing_date: "2004-01-04",
    launch_date: "2003-06-10",
    status: "Completed (R.I.P.)",
    max_date: '2010-03-21',
    total_photos: '124550'
  }];

  //due to the way the queries work, I won't be allowing user to select camera for now (too many api calls)
  //but I submitted an issue on the maintainer's github repo so maybe I will update this later :D
  //cameras in rover objects also won't be used, but I will keep it there for potential update later
  let cameras = [
    'FHAZ-Front Hazard Avoidance Camera',
    'RHAZ-Rear Hazard Avoidance Camera',
    'MAST-Mast Camera',
    'CHEMCAM-Chemistry and Camera Complex',
    'MAHLI-Mars Hand Lens Imager',
    'MARDI-Mars Descent Imager',
    'NAVCAM-Navigation Camera',
    'PANCAM-Panoramic Camera',
    'MINITES-Miniature Thermal Emission Spectrometer'
  ];

  getURI = () => {
    let date = $('#date').val();
    let rover = $('#rover').val();
    return `https://api.nasa.gov/mars-photos/api/v1/rovers/${rover}/photos?earth_date=${date}&api_key=Pe0cgsEjq6AGXZFT2GkmM4nzQAAgbRrB3c9qXke3`
  }

  getImages = (URI, rover) => {
    $.getJSON(URI, data => {
      if (data.photos.length < 1) {
        $('.error').html(`${rover} has no photos for that date. Maybe she was taking a nap? Try another date.`);
        toggleHide($('.error'), false);
      } else {
        toggleHide($('.error'), true);
        renderImages(data.photos, false);
        photos = data.photos;
        markFavorites();
      }
    }).fail(() => {
      $('.error').html('API issue - possible rate limit - check header of request');
      toggleHide($('.error'), false);
      $('form button').prop('disabled', false);
    })
  }

  renderImages = (images, bFavorites) => {
    $('#results-js').empty();
    if (bFavorites) {
      images.forEach(i => {
        $('#results-js').append(
          `<div class="col-3">
          <div class="container">
          <div class="imgContainer">
          <img class="marsImg" src="${i.img_src}" alt="A photo of Mars from ${i.rover.name}'s ${i.camera.full_name}">
          </div>
          <p>${i.rover.name}</p>
          <p>Sol ${i.sol}</p>
          <p> Earth ${i.earth_date}</p>
          <p>${i.camera.full_name}</p>
          <button id='PhotoID-${i.id}' class="favoriteButton hide">Favorite</button>
          </div>
          </div> `
        );
      })
    } else {
      images.forEach(i => {
        $('#results-js').append(
          `<div class="col-3">
        <div class="container">
        <div class="imgContainer">
        <img class="marsImg" src="${i.img_src}" alt="A photo of Mars from ${i.rover.name}'s ${i.camera.full_name}">
        </div>
        <p>Sol ${i.sol}</p>
        <p>${i.camera.full_name}</p>
        <button id='PhotoID-${i.id}' class="favoriteButton hide">Favorite</button>
        </div>
        </div> `
        );
      })
    }
  }

  getManifest = rover => {
    let lastManifestTime = localStorage.getItem('manifestTime');

    if (lastManifestTime && Date.now() - lastManifestTime < 3600000) {
      setManifest(JSON.parse(localStorage.getItem(rover)), rover);
    } else {
      let URI = encodeURI(`https://api.nasa.gov/mars-photos/api/v1/manifests/${rover}?api_key=Pe0cgsEjq6AGXZFT2GkmM4nzQAAgbRrB3c9qXke3`);

      $.getJSON(URI, manifest => {
        manifest = manifest.photo_manifest;
        setManifest(manifest, rover)
        localStorage.setItem(rover, JSON.stringify(manifest));
        localStorage.setItem('manifestTime', Date.now());
      })
    }
  }

  setManifest = (manifest, rover) => {
    rover = rovers.find(r => r.rover === rover);
    rover.landing_date = manifest.landing_date;
    rover.launch_date = manifest.launch_date;
    rover.status = manifest.status;
    rover.max_date = manifest.max_date;
    rover.total_photos = manifest.total_photos;
  }

  handleRoverChanged = () => {
    $('#rover').change(e => {
      let rover = rovers.find(r => r.rover === $(e.currentTarget).val());
      $('#date').val(rover.max_date);
      populateRoverSummary(rover);
      $('form button').prop('disabled', false);
      toggleHide($('#roverSummary'), false);
    })
  }

  handleDateChanged = () => {
    $('#date').change(e => {
      $('form button').prop('disabled', false);
      toggleHide($('#roverSummary'), false);
    })
  }

  populateRoverSummary = rover => {
    //need to find way to preload these images
    $('#roverSrc').prop('alt', `A photo of ${rover.rover}`)
    $('#roverSrc').prop('src', rover.img_src);
    $('#roverName').html(rover.rover);
    $('#roverLaunch').html(`Launch Date: ${rover.launch_date}`);
    $('#roverLand').html(`Landing Date: ${rover.landing_date}`);
    $('#roverStatus').html(`Mission Status: ${rover.status}`)
    $('#roverLastPhotoDate').html(`Latest Photos: ${rover.max_date}`);
    $('#roverTotalPhotos').html(`Total Photos: ${rover.total_photos}`);
  }

  populateBrowse = () => {
    toggleHide('.intro', true);
    toggleHide('.content', false);
    $('form button').prop('disabled', false);
    $('#results-js').empty();
    bOnHomePage = false;
    $('#rover').val('Curiosity');
    let initialRover = rovers.find(r => r.rover === 'Curiosity');
    $('#date').val(initialRover.max_date);
    populateRoverSummary(initialRover);
  }

  //this is also functionality that won't be used now, but I will keep it here in case
  //maintainer of api updates it to allow for easier camera search
  setCameraOptions = rover => {
    $('#camera').empty();
    rover = rovers.find(r => r.rover === rover);
    rover.cameras.forEach(c => {
      let camera = cameras[c].split('-')[1];
      $('#camera').append($("<option>").val(camera).html(camera));
    })
  }

  saveFavorite = photoID => {
    let photo = photos.find(p => p.id == photoID);
    let favorites = JSON.parse(localStorage.getItem('favorites'));

    //first favorite - make array
    if (!favorites) {
      favorites = [];
    }

    favorites.push(photo);
    localStorage.setItem('favorites', JSON.stringify(favorites));

  }

  removeFavorite = photoID => {
    let favorites = JSON.parse(localStorage.getItem('favorites'));
    let newFavorites = favorites.filter(f => {
      return f.id != photoID;
    })
    localStorage.setItem('favorites', JSON.stringify(newFavorites));
  }

  //button will show that the photo is favorited (if hovered over). need more styling in future
  markFavorites = () => {
    let favorites = JSON.parse(localStorage.getItem('favorites'));
    $('.container button').each((i, button) => {
      let photoID = $(button).prop('id').split('-')[1];
      favorites.forEach(f => {
        if (f.id == photoID) {
          $(button).text('Remove Favorite');
          toggleHide(button, 'false');
        }
      })
    })
  }

  handleBrowseClicked = () => {
    $('.begin-js').click(e => {
      populateBrowse();
      toggleHide('form', false)
    });
  };

  handleHomeClicked = () => {
    $('#brand').click(e => {
      if (!bOnHomePage) {
        toggleHide('.intro', false);
        toggleHide('.content', true);
        bOnHomePage = true;
      }
    });
  };

  handleFavLinkClicked = () => {
    $('#favLink').click(() => {
      toggleHide('.intro', true);
      toggleHide('.content', true);
      toggleHide('#browseLink', false);
      toggleHide('#results-js', false);
      $('form button').prop('disabled', false);
      $('#results-js').empty();
      let photos = JSON.parse(localStorage.getItem('favorites'));
      if (photos && photos.length > 0) {
        renderImages(photos, true);
        markFavorites();
      } else {
        $('#results-js').append('<p>You have no favorites! Go browse and find some!</p>');
      }

    })
  }

  handleImgClicked = () => {
    $('main').on('click', '.marsImg', e => {
      let src = $(e.currentTarget).prop('src');
      window.open(`${src}`, '_blank');
    })
  }

  handleContainerHover = () => {
    $('main').on('mouseenter', '.container', e => {
      let favoriteButton = $(e.currentTarget).find('button');
      toggleHide(favoriteButton, false);
    })
  }

  handleContainerLeave = () => {
    $('main').on('mouseleave', '.container', e => {
      let favoriteButton = $(e.currentTarget).find('button');
      toggleHide(favoriteButton, true);
    })
  }

  handleFavoriteClicked = () => {
    $('main').on('click', '.favoriteButton', e => {
      let photoID = $(e.currentTarget).prop('id').split('-')[1];
      let favText = $(e.currentTarget).text();
      if (favText === 'Favorite') {
        $(e.currentTarget).text('Remove Favorite');
        saveFavorite(photoID);
      } else {
        removeFavorite(photoID);
        $(e.currentTarget).text('Favorite');
      }
    })
  }

  handleFormSubmit = () => {
    $('form').submit(e => {
      e.preventDefault();
      $('#results-js').empty();
      $('form button').prop('disabled', true);
      selectedRover = rovers.find(r => r.rover === $('#rover').val());
      if ($(date).val() > selectedRover.max_date || $(date).val() < selectedRover.landing_date) {
        $('.error').html(`${selectedRover.rover} does not have photos for that date. She is not a time traveler. Change your date please.`);
        toggleHide($('.error'), false);
      } else {
        toggleHide($('#roverSummary'), true);
        getImages(getURI(), selectedRover.rover);
      }
    })
  }

  toggleHide = (target, hide) => {
    if (hide) {
      $(target).addClass('hide');
    } else {
      $(target).removeClass('hide');
    }
  }

  getManifest('Curiosity');
  getManifest('Opportunity');
  handleBrowseClicked();
  handleHomeClicked();
  handleFormSubmit();
  handleRoverChanged();
  handleDateChanged();
  handleImgClicked();
  handleContainerHover();
  handleContainerLeave();
  handleFavoriteClicked();
  handleFavLinkClicked();


  //for testing
  //toggleHide('.intro', true);
  //toggleHide('.content', false);
  //toggleHide('form', false)
  //bOnHomePage = false;
  //populateBrowse();
})
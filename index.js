$(() => {
  
  let bOnHomePage = true;
  const rovers =[{
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
    'MINITES-Miniature Thermal Emission Spectrometer'];
    
  getURI = () => {
    let date = $('#date').val();
    let rover = $('#rover').val();
    return `https://api.nasa.gov/mars-photos/api/v1/rovers/${rover}/photos?earth_date=${date}&api_key=Pe0cgsEjq6AGXZFT2GkmM4nzQAAgbRrB3c9qXke3`
  }
  
  getImages = URI => {
    $.getJSON(URI, data => {
      if (data.photos.length < 1) {
        //message for no photos for date
        console.log('handle no photos');
      } else {
        renderImages(data.photos);
      }
      
    }).fail(() => {
      //message for api limit exceeded
      console.log('handle api limit exceeded - check rate in header');
    })
  }
  
  //why is margin strange here
  renderImages = images => {
    images.forEach(i => {
      $('#results-js').append(
        `<div class="col-3">
        <div class="container">
        <div class="imgContainer">
        <img id=${i.id} class="marsImg" src="${i.img_src}">
        </div>
        <p>${i.camera.full_name}</p>
        <p>Sol ${i.sol}</p>
        <button>Hello</button>
        </div>
        </div> `
        );
    })
    $('form button').prop('disabled', false);
    toggleHide($('#roverSummary'), true);
  }
  
  getManifest = rover => {
    let lastManifestTime = localStorage.getItem('manifestTime');
    
    if(lastManifestTime && Date.now() - lastManifestTime < 3600000) {
      setManifest(JSON.parse(localStorage.getItem(rover)), rover);
    } 
    else {
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
    })
  }
  
  populateRoverSummary = rover => {
    //need to find way to preload these images
      $('#roverSrc').prop('src', rover.img_src);
      $('#roverName').html(rover.rover);
      $('#roverLaunch').html(`Launch Date: ${rover.launch_date}`);
      $('#roverLand').html(`Landing Date: ${rover.landing_date}`);
      $('#roverStatus').html(`Mission Status: ${rover.status}`)
      $('#roverLastPhotoDate').html(`Latest Photos: ${rover.max_date}`);
      $('#roverTotalPhotos').html(`Total Photos: ${rover.total_photos}`);
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
  
  handleBrowseClicked = () => {
    $('.begin-js').click(e => {
      toggleHide('.intro', true);
      toggleHide('.content', false);
      bOnHomePage = false;
      let initialRover = rovers.find(r => r.rover === 'Curiosity');
      $('#date').val(initialRover.max_date);
      populateRoverSummary(initialRover);
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
  
  handleImgClicked = () => {
    $('main').on('click', '.marsImg', e => {
      let src = $(e.currentTarget).prop('src');
      window.open(`${src}`, '_blank');
    })
  }

  handleFormSubmit = () => {
    $('form').submit(e => {
      e.preventDefault();
      $('#results-js').empty();
      $('form button').prop('disabled', true);
      selectedRover = rovers.find(r => r.rover === $('#rover').val());
      console.log(selectedRover);
      if($(date).val() > selectedRover.max_date) {
        //message for date exceeded
        console.log('date exceeded');
      } else {
        getImages(getURI());
      }
      
    })
  }

  toggleHide = (target, hide) => {
    if(hide) {
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
  handleImgClicked();
  
  
  //for testing
  toggleHide('.intro', true);
  toggleHide('.content', false);
  bOnHomePage = false;
})
$(() => {
  
  let bOnHomePage = true;
  const rovers =[{
    rover: 'Curiosity',
    img_src: 'images/curiosity.jpeg',
    cameras: [0, 1, 2, 3, 4, 5, 6],
    landing_date:	"2012-08-06",
    launch_date:	"2011-11-26",
    status: 'Active'
  }, {
    rover: 'Opportunity',
    img_src: 'images/opportunity.jpg',
    cameras: [0, 1, 6, 7, 8],
    landing_date:	"2004-01-25",
    launch_date:	"2003-07-07",
    status: 'Active'
  }, {
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
    console.log(URI)
    $.getJSON(URI, data => {
      renderImages(data.photos);
    }).fail(() => {
      console.log('fail');
    })
  }
  
  renderImages = images => {
    toggleHide($('#roverSummary'));
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
  
  getManifest = rover => {
    let lastManifestTime = localStorage.getItem('manifestTime');
    
    if(lastManifestTime && Date.now() - lastManifestTime < 3600000) {
      console.log('true');
      setManifest(JSON.parse(localStorage.getItem(rover)));
    } 
    else {
      let URI = encodeURI(`https://api.nasa.gov/mars-photos/api/v1/manifests/${rover}?api_key=Pe0cgsEjq6AGXZFT2GkmM4nzQAAgbRrB3c9qXke3`);
      $.getJSON(URI, manifest => {
      setManifest(manifest)
      localStorage.setItem(rover, JSON.stringify(manifest));
      localStorage.setItem('manifestTime', Date.now());
    })
    }
    
  }
  
  setManifest = (manifest, rover) => {
    rover = rovers.find(r => r.rover === rover);
    console.log(manifest);
  }
  
  handleRoverChanged = () => {
    $('#rover').change(e => {
      let rover = rovers.find(r => r.rover === $(e.currentTarget).val());
      if($('#roverSummary').hasClass('hide')) {
        toggleHide($('#roverSummary'));
      }
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
  handleRoverChanged();
  populateRoverSummary(rovers.find(r => r.rover === 'Curiosity'));
  getManifest('Curiosity');
  getManifest('Opportunity');
  
  //for testing
  toggleHide('.intro');
  toggleHide('.content');
  bOnHomePage = false;
})
mdc.autoInit()
const topAppBarElement = document.querySelector('.mdc-top-app-bar');
const topAppBar = new mdc.topAppBar.MDCTopAppBar(topAppBarElement);
const drawer = mdc.drawer.MDCDrawer.attachTo(document.querySelector('.mdc-drawer'));
const listElements = document.querySelector('.mdc-drawer .mdc-list');
const fieldFloats = [...document.querySelectorAll(".mdc-floating-label")].map(e => mdc.floatingLabel.MDCFloatingLabel.attachTo(e))
const texts = [...document.querySelectorAll(".mdc-text-field")].map(_ => mdc.textField.MDCTextField.attachTo(_))

document.querySelector(".mdc-top-app-bar__navigation-icon").addEventListener('click', () => {
  drawer.open = true;
})
listElements.addEventListener('click', (event) => {
  drawer.open = false;
});

initalizeDB("home").then(_ => increaseVisit("home"))
// special condition for location api page and for user data page
const pageVisit = screen => [document.querySelector(`#${screen}`).style.display = screen == 'location' ? 'inline-grid' : 'inline-block', document.querySelectorAll(`.screens:not(#${screen})`).forEach(el => el.style.display = 'none'), increaseVisit(screen), screen == 'data' ? drawChart() : '']

document.querySelectorAll('button[data-screen]').forEach(b => b.addEventListener('click', e => pageVisit(b.dataset.screen)))
document.querySelectorAll('.mdc-list-item[data-screen]').forEach(b => b.addEventListener('click', e => pageVisit(b.dataset.screen)))

const imgLoading = document.querySelector('#image_loading')
document.querySelector('#img_button').addEventListener('click', e => {
  let width = document.querySelector("#width").value
  let height = document.querySelector("#height").value
  if (width.length < 1) {
    width = 200
  }
  if (height.length < 1) {
    height = 300
  }

  imgLoading.style.display = 'block'
  document.querySelector('#image_error').style.display = 'none'
  const url = `https://picsum.photos/${width}/${height}`
  
  fetch(url)
    .then(response => response.blob())  
    .then(randomImage => { 
        const imgUrl = URL.createObjectURL(randomImage);
        document.querySelector("#random_image > div > div.mdc-card__primary-action > div.mdc-card__media.mdc-card__media--16-9").style.backgroundImage = `url("${imgUrl}")`
        document.querySelector('#image_loading').style.display = 'none'
    }).catch(e => document.querySelector('#image_error').style.display = 'block');
})

const updateTxtField = (_, c, idx) => {
  _.children[0].children[1].style.width = fieldFloats[idx].getWidth() * .80 + 8 + "px"
  fieldFloats[idx].float(true)
  _.children[1].value = c 
  _.children[0].classList.add("mdc-notched-outline--notched")
}

document.querySelector('button[data-button="locate"]').addEventListener('click', e => {
  function errHandler(err) {
    console.warn(`ERROR(${err.code}): ${err.message}`);
    updateTxtField(document.querySelector("#latitude_box"), "geolocation error", 1)
    updateTxtField(document.querySelector("#longitude_box"), "geolocation error", 2)
  }
  
  const configs = {
    enableHighAccuracy: true,
    timeout: 6000,
    maximumAge: 0
  };
  
  function successHandler(coord) {
    const crd = coord.coords;
    updateTxtField(document.querySelector("#latitude_box"), crd.latitude, 1)
    updateTxtField(document.querySelector("#longitude_box"), crd.longitude, 2)
  }

  
  navigator.geolocation.getCurrentPosition(successHandler, errHandler, configs);
})

document.querySelector('button[data-button="location_get"]').addEventListener('click', e => {
  document.querySelector('#data_error').style.display = 'none'
  document.querySelector('#data_loading').style.display = 'block'
  
  const lat = document.querySelector('#latitude').value
  const long = document.querySelector('#longitude').value
  const apiUrl = `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${lat}&longitude=${long}&localityLanguage=en`

  fetch(apiUrl)
  .then((response) => response.json())
  .then((data) => {
    document.querySelector('#data_loading').style.display = 'none'
    document.querySelector("#city").innerText = data.city
    document.querySelector("#country").innerText = data.countryName
    document.querySelector("#continent").innerText = data.continent
    document.querySelector("#subdivision").innerText = data.principalSubdivision
    
  })
  .catch(e => document.querySelector('#data_error').style.display = 'block')
})

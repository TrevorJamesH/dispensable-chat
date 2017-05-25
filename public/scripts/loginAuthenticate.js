function login() {
  fetch('/login', {method: 'get'})
  .then(response => response.json())
  .then( response => {
    if (response.redirectUrl) {
      window.location = response.redirectUrl
    } else {
      console.error('Oh no, error')
      // Display error
    }
  })
}

function signup() {
  fetch('/signup', {method: 'get'})
  .then(response => response.json())
  .then( response => {
    if (response.redirectUrl) {
      window.location = response.redirectUrl
    } else {
      console.error('Oh no, error')
      // Display error
    }
  })
}
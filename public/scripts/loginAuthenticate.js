/*eslint no-console: ["error", { allow: ["warn", "error"] }] */

function login() { // eslint-disable-line
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

function signup() { // eslint-disable-line
  fetch('/signup', {method: 'get'})
  .then(response => response.json())
  .then( response => {
    if (response.redirectUrl) {
      window.location = response.redirectUrl
    } else {
      console.error('Oh no, error')
    }
  })
}
function login() {
  console.log('youve logged in')
  fetch('/login', {method: 'post', redirect: 'follow'})
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
  console.log('youve signed up in')
}

function loadRoom( roomName ){
  console.log('loadRoom', roomName)
}

// document.addEventListener('DOMContentLoaded', () => {
//
// })

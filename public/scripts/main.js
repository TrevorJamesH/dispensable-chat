function login() {
  console.log('youve logged in')
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
  console.log('youve logged in')
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

function loadRoom( roomName ){
  console.log('loadRoom', roomName)
}

function getRooms() {
  fetch('/getAllRooms', {method: 'get'})
  .then(response => response.json())
  .then( response => {
    if (response) {
      const values = response.map(obj => {
        return Object.values(obj)[0]
      })
      values.forEach(value => {
        const room = document.createElement('button')
        room.setAttribute('class', 'button roomName')
        room.onclick = () => loadRoom(value)
        room.innerText = value

        document.querySelector('.chatroomList').appendChild(room)
      })


      console.log(values)
    } else {
      console.error('Oh no, nothing came back')
      // Display error
    }
  })
}

document.addEventListener('DOMContentLoaded', () => {
 getRooms()
})

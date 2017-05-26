/*eslint no-console: ["error", { allow: ["warn", "error"] }] */
const socket = io() // eslint-disable-line

function fetchRooms() {
  return fetch('/getRoomsByUserId', {
    method: 'post',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      user_id: getUserID()
    })
  })
  .then(response => response.json())
}

function changeRoom( roomId ) {
  sessionStorage.setItem('currentChatRoom', roomId )
  getChats()
  populateRoomDom()
}

function logout() {
  fetch('/logout/redirect', {method: 'get'})
  .then( response => response.json())
  .then( response => {
    console.log('response', response.url)
    if(response.url) {
      window.location = response.url
    }
    else {
      console.error('No response') // eslint-disable-line
    }
  })
}

function getRoom(){
  return Number(sessionStorage.getItem('currentChatRoom'))
}

function populateRoomDom() {
  fetchRooms()
  .then( response => {
    if (response) {
      document.querySelector('.chatroomList').innerHTML = ''
      response.forEach( chatRoom => {
        const room = document.createElement('button')
        room.setAttribute('class', 'button roomName')
        room.onclick = () => changeRoom(chatRoom.id)
        room.innerText = chatRoom.name

        const unsubscribeButton = document.createElement('button')
        unsubscribeButton.setAttribute('class', 'button unsubscribe')
        unsubscribeButton.onclick = () => unsubscribe( chatRoom.id )
        unsubscribeButton.style.flexGrow = '1'
        unsubscribeButton.innerText = 'X'
        room.style.flexGrow = '7'

        const roomAndButton = document.createElement('div')
        roomAndButton.style.display = 'flex'
        roomAndButton.appendChild(room)
        roomAndButton.appendChild(unsubscribeButton)

        document.querySelector('.chatroomList').appendChild(roomAndButton)
      })

    } else {
      console.error('Oh no, nothing came back')
    }
  })
}

function unsubscribe( roomId ) {
  return fetch('/unsubscribe', {
    method: 'post',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      roomId: roomId,
      userId: getUserID()
    })
  })
  .then( () => {
    populateRoomDom()
  })
}

function sendButtonClicked() { // eslint-disable-line
  checkNotEmpty(document.querySelector('.inputText').value)
}

function checkEnter() { // eslint-disable-line
  const key = window.event.keyCode
  if(key === 13){
    window.event.preventDefault()
    checkNotEmpty(document.querySelector('.inputText').value)
  }
}

function checkNotEmpty(text) {
  if(/[^\s]/.test(text)){
    submitChatMessage()
  }
}


function submitChatMessage() {
  var currentRoomID = getRoom()
  let inputText = document.querySelector('.inputText').value

  fetch('/postChat', {
    method: 'post',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      chat: inputText,
      room: currentRoomID,
      user_id: getUserID()
    }),
  })
  .then( () => {
    getChats()
    socket.emit('chat message', inputText)
  })
  document.querySelector('.inputText').value = ''
}

function addChatRoom(){ // eslint-disable-line
  const input = document.createElement('input')
  input.setAttribute('class','roomName inputChat')

  const checkValidRoomName = () => {
    return (/[^\s]/.test(input.value))
  }

  input.onkeypress = () => {
    const key = window.event.keyCode
    if(key === 13){
      input.blur()
      window.event.preventDefault()
    }
  }

  input.onblur = () => {
    if(checkValidRoomName()){
      postRoom(input.value)
    } else {
      populateRoomDom()
    }
  }

  document.querySelector('.chatroomList').appendChild(input)
  input.focus()
}

function postRoom(roomName){
  fetch('/postRoom', {
    method: 'post',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      roomName: roomName
    })
  })
  .then( response => response.json() )
  .then( (response) => {
    socket.emit('new room', roomName)
    changeRoom(response[0].id)
    subscribeUser( response[0].id )
  })
}

function getUserID(){
  return Number(document.cookie.split('=')[1])
}

function subscribeUser(roomId){
  fetch('/subscribeUser', {
    method: 'post',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      userId: getUserID(),
      roomId: roomId
    })
  })
  .then(() => {
    populateRoomDom()
  })
}

function getChats(){
  const room = getRoom()
  document.querySelector('.messages').innerHTML = ''
  fetch('/getAllChatsByRoom', {
    method: 'post',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      roomId: room
    })
  })
  .then(response => response.json())
  .then( response => {
    response.forEach(chat => {
      const chatDom = document.createElement('p')
      chatDom.setAttribute('class', chat.user_id === getUserID() ? 'user' : null )
      chatDom.innerText = chat.chat
      document.querySelector('.messages').appendChild(chatDom)

      const messages = document.querySelector('.messages')
      messages.scrollTop = messages.scrollHeight
    })
  })
}

document.addEventListener('DOMContentLoaded', () => {
  populateRoomDom()
  if(sessionStorage.hasOwnProperty('currentChatRoom')){
    getChats()
  }
  const searchBar = document.querySelector('.searchBar')
  searchBar.addEventListener('input', (event) => {
    fetch('/getAllRooms', {method: 'get'})
    .then(response => response.json())
    .then( rooms => {
      const input = event.target
      autoComplt.enable(input, { // eslint-disable-line
        hintsFetcher: (v, openList) => {
          const hints = []
          for (let i = 0; i < rooms.length; i++) {
            if (rooms[i].name.indexOf(v) >= 0) {
              hints.push(rooms[i].name+' : '+rooms[i].id)
            }
          }
          openList(hints)
        }
      })
    })
  })

  searchBar.addEventListener('keypress', (event) => {
    const key = event.keyCode
    if(key === 13){
      subscribeUser(searchBar.value.split(' : ')[1])
    }
  })

  socket.on('get messages', () => {
    getChats()
  })

  socket.on('get rooms', () => {
    populateRoomDom()
  })

  socket.on('disconnect', () => {
    socket.disconnect()
  })
})

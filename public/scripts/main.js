/*eslint no-console: ["error", { allow: ["warn", "error"] }] */

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

function getRoom(){
  return Number(sessionStorage.getItem('currentChatRoom'))
}

function populateRoomDom() {
  fetchRooms()
  .then( response => {
    console.log('populateRoomDom response',response)
    if (response) {
      document.querySelector('.chatroomList').innerHTML = ''
      response.forEach( chatRoom => {
        const room = document.createElement('button')
        room.setAttribute('class', 'button roomName')
        room.onclick = () => changeRoom(chatRoom.id)
        room.innerText = chatRoom.name

        document.querySelector('.chatroomList').appendChild(room)
      })

    } else {
      console.error('Oh no, nothing came back')
    }
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

const socket = io() // eslint-disable-line

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

function subscribeUser(roomName){
  const user_id = getUserID()

  fetch('/subscribeUser', {
    method: 'post',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      user_id: user_id,
      roomName: roomName
    })
  })
  .then(() => {
    populateRoomDom()
  })
}

function getChats(){
  const room = getRoom()
  document.querySelector('.messages').innerHTML = ''
  console.log('roomid====>', room)
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

  document.querySelector('.searchBar').addEventListener('input', (event) => {
    fetchRooms()
    .then( roomInputs => {
      const rooms = roomInputs.map( roomContainer => {
        return roomContainer.room
      })
      const input = event.target
      autoComplt.enable(input, {
        hintsFetcher: (v, openList) => {
          const hints = []
          for (let i = 0; i < rooms.length; i++) {
            if (rooms[i].indexOf(v) >= 0) {
              hints.push(rooms[i])
            }
          }
          openList(hints)
        }
      })
    })
  })

  socket.on('get messages', () => {
    getChats()
  })

  socket.on('get rooms', () => {
    populateRoomDom()
  })
})

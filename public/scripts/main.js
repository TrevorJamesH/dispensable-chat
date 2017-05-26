/*eslint no-console: ["error", { allow: ["warn", "error"] }] */

function listRooms() {
  return fetch('/getAllRooms', {method: 'get'})
    .then(response => response.json())
}

function getRooms() {
  listRooms()
  .then( response => {
    if (response) {
      const values = response.map(rooms => {
        return Object.values(rooms)[0]
      })
      document.querySelector('.chatroomList').innerHTML = ''
      values.forEach(value => {
        const room = document.createElement('button')
        room.setAttribute('class', 'button roomName')
        room.onclick = () => getChats( value )
        room.innerText = value

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
  var currentRoomName = sessionStorage.getItem('currentChatRoom')
  let inputText = document.querySelector('.inputText').value

  fetch('/postChat', {
    method: 'post',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      chat: inputText,
      room: currentRoomName,
      user_id: getUserID()
    }),
  })
  .then( () => {
    getChats( currentRoomName )
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
      sessionStorage.setItem('currentChatRoom', input.value)
      postChatRoom(input.value)
    } else {
      getRooms()
    }
  }

  document.querySelector('.chatroomList').appendChild(input)
  input.focus()
}

function postChatRoom(chatroom){
  fetch('/postChat', {
    method: 'post',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      chat: 'Welcome',
      room: chatroom,
      user_id: getUserID()
    })
  })
  .then( () => {
    socket.emit('new room', chatroom)
    getRooms()
    getChats( chatroom )
  })
}

function getUserID(){
  return Number(document.cookie.split('=')[1])
}

function getChats( room ){
  sessionStorage.setItem('currentChatRoom', room)

  document.querySelector('.messages').innerHTML = ''
  fetch('/getAllChatsByRoom/'+room, {method: 'get'})
  .then(response => response.json())
  .then( response => {
    response.forEach(chat => {
      const chatDom = document.createElement('p')
      console.log(getUserID())
      console.log(chat.user_id)
      chatDom.setAttribute('class', chat.user_id === getUserID() ? 'user' : null )
      chatDom.innerText = chat.chat
      document.querySelector('.messages').appendChild(chatDom)

      const messages = document.querySelector('.messages')
      messages.scrollTop = messages.scrollHeight
    })
  })
}

document.addEventListener('DOMContentLoaded', () => {
  getRooms()
  if(sessionStorage.hasOwnProperty('currentChatRoom')){
    getChats(sessionStorage.getItem('currentChatRoom'))
  }

  document.querySelector('.searchBar').addEventListener('input', (event) => {
    listRooms()
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
    getChats( sessionStorage.getItem('currentChatRoom' ))
  })

  socket.on('get rooms', () => {
    getRooms()
  })
})

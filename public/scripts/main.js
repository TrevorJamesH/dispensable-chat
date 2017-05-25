function getRooms() {
  fetch('/getAllRooms', {method: 'get'})
  .then(response => response.json())
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
      // Display error
    }
  })
}

function checkEnter(){
  const key = window.event.keyCode
  if(key === 13){
    window.event.preventDefault()
    checkNotEmpty(document.querySelector('.inputText').value)
  }
}

function checkNotEmpty(text){
  if(/[^\s]/.test(text)){
    submitChatMessage()
  }
}

const socket = io()

function submitChatMessage(){
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
      user: 'user2'
    }),
  })
  .then(response => response.json())
  .then(response => {
    getChats( currentRoomName )
    socket.emit('chat message', inputText)
  })
  document.querySelector('.inputText').value = ''
}

function addChatRoom(){
  const input = document.createElement('input')
  input.setAttribute('class','roomName')

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
      user: 'Bill Nye'
    })
  })
  .then(response => response.json())
  .then(response => {
    getRooms()
    getChats( chatroom )
  })
}

function getChats( room ){
  //temp dummy data
  const user = 'user3'
  sessionStorage.setItem('currentChatRoom', room)

  document.querySelector('.messages').innerHTML = ''
  fetch('/getAllChatsByRoom/'+room, {method: 'get'})
  .then(response => response.json())
  .then( response => {
    const values = response.forEach(chat => {
      const chatDom = document.createElement('p')
      chatDom.setAttribute('class', chat.user === user ? 'user' : null )
      chatDom.innerText = chat.chat
      document.querySelector('.messages').appendChild(chatDom)

      const messages = document.querySelector('.messages')
      messages.scrollTop = messages.scrollHeight;
    })
  })
}

document.addEventListener('DOMContentLoaded', () => {
  getRooms()
  if(sessionStorage.hasOwnProperty('currentChatRoom')){
    getChats(sessionStorage.getItem('currentChatRoom'))
  }

  socket.on('get messages', function(data) {
    getChats( sessionStorage.getItem('currentChatRoom' ))
    console.log('recieving new chats')
  })
})

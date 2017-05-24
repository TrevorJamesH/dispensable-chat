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

function getRooms() {
  fetch('/getAllRooms', {method: 'get'})
  .then(response => response.json())
  .then( response => {
    if (response) {
      const values = response.map(rooms => {
        return Object.values(rooms)[0]
      })
      values.forEach(value => {
        const room = document.createElement('button')
        room.setAttribute('class', 'button roomName')
        room.onclick = () => getChats( value )
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

function checkEnter(){
  const key = window.event.keyCode
  if(key === 13){
    window.event.preventDefault()
    checkNotEmpty()
  }
}

function checkNotEmpty(){
  if(/[^\s]/.test(document.querySelector('.inputText').value)){
    submitChatMessage()
  }
}

function submitChatMessage(){
  var currentRoomName = sessionStorage.getItem('currentChatRoom')
  console.log("I think the room your in is:", currentRoomName)
  let inputText = document.querySelector('.inputText').value
  console.log('inputText',inputText)
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
  })
  document.querySelector('.inputText').value = ''
}

function getChats( room ){
  console.log("Im the current room", room)
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
})

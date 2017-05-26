const Knex = require('knex')
const knex = Knex(require('./knexfile.js').development)

const getAllChatsByRoom = (roomName) => {
  return getRoomIdByName(roomName)
  .then( roomId => {
    return knex
    .table('chats')
    .where('room_id', roomId)
    .orderBy('id', 'asc')
    .returning('*')
  })
}

const postChat = (chat, roomName, user_id) => {
  return getRoomIdByName(roomName)
  .then( roomId => {
    return knex
    .table('chats')
    .insert({
      chat: chat,
      user_id: user_id,
      room_id: roomId
    })
  })
}

const postRoom = (roomName) => {
  return knex
  .table('chatRooms')
  .insert({
    name: roomName
  })
  .returning('*')
}

const getRoomIdByName = (roomName) => {
  return knex
  .table('chatRooms')
  .where('name', roomName)
  .select()
  .returning('id')
}

const getAllRooms = () => {
  return knex
  .table('chatRooms')
  .distinct('name')
  .select()
}

const addUserToRoom = (user_id, roomName) => {
  getRoomIdByName(roomName)
  .then( roomId => {
    return knex
    .table('userRooms')
    .insert({
      room_id: roomId,
      user_id: user_id
    })
  })
}

module.exports = {
  postChat, getAllChatsByRoom, getAllRooms
}

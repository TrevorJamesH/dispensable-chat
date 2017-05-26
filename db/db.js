const Knex = require('knex')
const knex = Knex(require('./knexfile.js').development)

const getAllChatsByRoom = (roomName) => {
  return getRoomIdByName(roomName)
  .then( roomId => {
    return knex
    .table('chats')
    .where('room', room)
    .orderBy('id', 'asc')
    .returning('*')
  })
}

const postChat = (chat, roomName, user_id) => {
  return knex.transaction( (trx) => {
    getRoomIdByName(roomName)
    .then( roomId => {
      return knex('userRooms')
      .transacting(trx)
      .insert({
        room_id: roomId,
        user_id: user_id
      })
    })
    .then(() => {
      knex('chats')
      .transacting(trx)
      .insert({
        chat: chat,
        user_id: user_id
      })
    })
    .then(trx.commit)
    .catch(trx.rollback)
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
  .where('room', roomName)
  .select()
  .returning('id')
}

const getAllRooms = () => {
  return knex
  .table('chats')
  .distinct('room')
  .select()
}

module.exports = {
  postChat, getAllChatsByRoom, getAllRooms
}

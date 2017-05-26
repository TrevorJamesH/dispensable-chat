const Knex = require('knex')
const knex = Knex(require('./knexfile.js').development)

const getAllChatsByRoom = (roomId) => {
  return knex
  .table('chats')
  .where('room_id', roomId)
  .orderBy('id', 'asc')
  .returning('*')
}

const postChat = (chat, roomId, userId) => {
  return knex
  .table('chats')
  .insert({
    chat: chat,
    user_id: userId,
    room_id: roomId
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
  .first('id')
  .from('chatRooms')
  .where('name', roomName)
}

const getAllRooms = () => {
  return knex
  .table('chatRooms')
  .select('*')
}

const unsubscribe = (userId, roomId) => {
  return knex('userRooms')
  .where({'room_id': roomId, 'user_id': userId})
  .del()
}

const getRoomsByUserId = ( user_id ) => {
  return knex
  .select('chatRooms.name', 'chatRooms.id')
  .from('userRooms')
  .where('user_id', user_id)
  .innerJoin('chatRooms', 'chatRooms.id', 'userRooms.room_id')
}

const addUserToRoom = (userId, roomId) => {
  return knex
  .table('userRooms')
  .insert({
    room_id: roomId,
    user_id: userId
  })
  .returning('*')
}

module.exports = {
  postChat, unsubscribe, getAllChatsByRoom, getAllRooms, postRoom, addUserToRoom, getRoomsByUserId
}

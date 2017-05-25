
exports.up = function(knex) {
  return knex.schema.createTable('chats', function(table){
    table.increments('id').primary()
    table.string('chat')
    table.string('room')
    table.string('user')
  })
}

exports.down = function(knex) {
  return knex.schema.table('chats', function(table){
    table.dropColumns('id','chat','room','user')
  })
}

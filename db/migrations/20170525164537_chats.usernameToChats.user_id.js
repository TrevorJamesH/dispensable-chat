exports.up = function(knex) {
  return knex.schema.table('chats', function(table){
    table.dropColumn('user')
    table.integer('user_id')
  })
}

exports.down = function(knex) {
  return knex.schema.table('chats', function(table){
    table.dropColumn('user_id')
    table.string('user')
  })
}

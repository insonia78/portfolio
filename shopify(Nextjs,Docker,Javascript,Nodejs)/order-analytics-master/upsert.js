export default function upsertItem(knex, tableName, conflictTarget, itemData) {
  let exclusions = Object.keys(itemData)
    .filter(c => c !== conflictTarget)
    .map(c => knex.raw('?? = EXCLUDED.??', [c, c]).toString())
    .join(",\n");

  let insertString = knex(tableName).insert(itemData).toString();
  let conflictString = knex.raw(` ON CONFLICT (??) DO UPDATE SET ${exclusions} RETURNING *;`, conflictTarget).toString();
  let query = (insertString + conflictString).replace(/\?/g, '\\?');

  return knex.raw(query)
    .then(result => result.rows[0]);
};

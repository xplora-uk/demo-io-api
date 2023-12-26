import sqlts, { Config } from '@rmp135/sql-ts';

main();

async function main() {
  const config: Config = {
    client: 'mysql2',
    connection: {
      host    : '127.0.0.1',
      user    : 'root',
      password: '',
      database: 'xplora_o2o_db_20231215_stg',
    },
    tableNameCasing: 'pascal',
    interfaceNameFormat: 'Dto${table}',
    columnNameCasing: 'original',
    globalOptionality: 'required',
    enumNameFormat: 'Enum_${name}',
  };
  const definitions = await sqlts.toObject(config);
  definitions.tables.forEach(d => { d.interfaceName = d.interfaceName.replace(/DtoTbl/, 'Dto') + ' extends IDbDto'; });
  const output = sqlts.fromObject(definitions, config);
  console.log(output);

  // TODO: prepend the following to the output file
  // import { IDbDto } from '../../../services/db/types'; // added after code generation
}

import { EnvService } from '../env';
import { ILoggerService } from '../logger/types';
import { IConfigService, IDbConfig } from './types';

export class ConfigService implements IConfigService {
  constructor(public env: EnvService, protected logger: ILoggerService) {

  }

  get http() {
    const port = this.env.int('HTTP_PORT', 8080);
    return {
      port,
    };
  }

  _getDbConfig(dbKeyPrefix: string): IDbConfig {
    const env = this.env.newEnv(dbKeyPrefix);

    const dbUrl = env.str('DB_URL', 'mysql://localhost/db');
    const url = new URL(dbUrl);
    const schema = url.searchParams.get('schema') || 'public';

    let client = url.protocol.replace(/:$/, '');
    if (client === 'mysql') client = 'mysql2';

    let port = Number.parseInt(url.port, 10);
    if (port <= 0 || Number.isNaN(port)) {
      if (client === 'sqlite3') port = 0;
      if (client ==='mysql2') port = 3306;
      if (client === 'pg') port = 5432;
    }

    const conf = {
      knexConfig: {
        client,
        useNullAsDefault: true,
        acquireConnectionTimeout: 5000, // TODO: make this configurable
        connection: {
          host    : url.hostname,
          port,
          user    : url.username,
          password: url.password,
          database: url.pathname.replace(/^\//, ''),
        },
        searchPath: [ schema ],
        pool: {
          min: env.int('DB_POOL_MIN', 5),
          max: env.int('DB_POOL_MAX', 100),
        },
      },
    };

    this.logger.debug('ConfigService._getDbConfig', dbKeyPrefix, conf);

    return conf;
  }

  get coreDbRw(): IDbConfig {
    return this._getDbConfig('CORE_RW_');
  }
  get coreDbRo(): IDbConfig {
    return this._getDbConfig('CORE_RO_');
  }
  get fcmDbRw(): IDbConfig {
    return this._getDbConfig('FCM_RW_');
  }
  get fcmDbRo(): IDbConfig {
    return this._getDbConfig('FCM_RO_');
  }
  get geoLocationDbRw(): IDbConfig {
    return this._getDbConfig('GEO_LOCATION_RW_');
  }
  get geoLocationDbRo(): IDbConfig {
    return this._getDbConfig('GEO_LOCATION_RO_');
  }
}

import { EnvService } from '../env';
import { defaultLogger } from '../logger';
import { ILoggerService } from '../logger/types';
import { IConfigService, IDbConfig } from './types';

export class ConfigService implements IConfigService {
  constructor(public env: EnvService, protected logger: ILoggerService = defaultLogger) {

  }

  get http() {
    const port = this.env.int('HTTP_PORT', 8080);
    return {
      port,
    };
  }

  _getDbConfig(dbKeyPrefix: string): IDbConfig {
    const dbUrl = this.env.str(dbKeyPrefix + 'DB_URL');
    const url = new URL(this.env.str(dbUrl, 'mysql://localhost/db'));
    const schema = url.searchParams.get('schema') || 'public';

    const conf = {
      knexConfig: {
        client: url.protocol.replace(/:$/, ''),
        useNullAsDefault: true,
        acquireConnectionTimeout: 5000, // TODO: make this configurable
        connection: {
          host    : url.hostname,
          port    : Number(url.port),
          user    : url.username,
          password: url.password,
          database: url.pathname.replace(/^\//, ''),
        },
        searchPath: [ schema ],
        pool: {
          min: this.env.int('DB_POOL_MIN', 5, dbKeyPrefix),
          max: this.env.int('DB_POOL_MAX', 100, dbKeyPrefix),
        },
      },
    };

    this.logger.info('ConfigService._getDbConfig', dbKeyPrefix, conf);

    return conf;
  }

  get coreDbRw(): IDbConfig {
    return this._getDbConfig('CORE_RW_');
  }
  get coreDbRo(): IDbConfig {
    return this._getDbConfig('CORE_RO_');
  }
  get fcmDbRw(): IDbConfig {
    return this._getDbConfig('FCM_RW_DB_URL');
  }
  get fcmDbRo(): IDbConfig {
    return this._getDbConfig('FCM_RO_DB_URL');
  }
  get geoLocationDbRw(): IDbConfig {
    return this._getDbConfig('GEO_LOCATION_RW_DB_URL');
  }
  get geoLocationDbRo(): IDbConfig {
    return this._getDbConfig('GEO_LOCATION_RO_DB_URL');
  }
}

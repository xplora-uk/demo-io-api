import { readSecrets } from './secrets';
import { factory } from './services/factory';

main();

async function main() {
  await readSecrets();
  const f = await factory(process.env);
  f.start();
}

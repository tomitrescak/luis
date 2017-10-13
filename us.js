require('./mocha');

const config = require('chai-match-snapshot').config;

/* you can choose following snapshot mode
 * - tcp: updated snapshots are sent to VS Code extension over TCP. 
 *        [!!! IMPORTANT] Make sure the extension is enabled before running
 * - drive: updated snapshots are automatically saved to your drive
 * - both: snapshots are sent to VS Code extension AND saved to drive
 * - test: standard mode during running your tests, when snapshots are NOT updated but compared
 */
config.snapshotMode = 'drive';
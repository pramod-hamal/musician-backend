import { Queue } from 'bull';
import * as fastcsv from 'fast-csv';
import { Readable } from 'stream';
import { parentPort } from 'worker_threads';

const importArtistCsv = (fileBuffer: Buffer, csvImportQueue: Queue) => {
  const results = [];
  const bufferStream = Readable.from(fileBuffer);

  bufferStream
    .pipe(fastcsv.parse({ headers: true, ignoreEmpty: true }))
    .on('data', async (row) => {
      await csvImportQueue.add('process-row', row);
      results.push(row);
    })
    .on('end', () => {
      parentPort?.postMessage({ success: true, importedRows: results.length });
    })
    .on('error', (error) => {
      parentPort?.postMessage({ success: false, error: error.message });
    });
};

parentPort.on('message', async (message) => {
  const { fileBuffer, queue: csvImportQueue } = message;

  importArtistCsv(fileBuffer, csvImportQueue);
});

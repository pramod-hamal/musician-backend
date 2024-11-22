import * as fastcsv from 'fast-csv';
import { Readable } from 'stream';
import { parentPort } from 'worker_threads';

const processCsv = (fileBuffer: Buffer | Uint8Array) => {
  const buffer = Buffer.isBuffer(fileBuffer)
    ? fileBuffer
    : Buffer.from(fileBuffer);

  const bufferStream = Readable.from(buffer);
  bufferStream
    .pipe(
      fastcsv.parse({
        headers: true,
        ignoreEmpty: true,
        strictColumnHandling: false,
      }),
    )
    .on('headers', (headers: string[]) => {
      const requiredFields = [
        'first_name',
        'last_name',
        'email',
        'password',
        'phone',
        'dob',
      ];
      let matchCount = 0;
      for (let i = 0; i < headers.length && matchCount <= 6; i++) {
        const header = headers[i].trim().toLocaleLowerCase();
        if (requiredFields.includes(header)) {
          matchCount = matchCount + 1;
        }
      }

      if (matchCount != 6) {
        parentPort.postMessage({
          success: false,
          error: `invalid csv header: headers should include: ${requiredFields}`,
        });
      }
    })
    .on('data', (row) => {
      // sending message to main thread
      parentPort.postMessage({ data: row });
    })
    .on('end', () => {
      parentPort?.postMessage({ success: true });
    })
    .on('error', (error) => {
      console.error('Error parsing CSV:', error);
      parentPort?.postMessage({ success: false, error: error.message });
    });
};

// Listening to message from main thread
parentPort?.on('message', (message) => {
  const { fileBuffer } = message;

  if (
    !fileBuffer ||
    !(Buffer.isBuffer(fileBuffer) || fileBuffer instanceof Uint8Array)
  ) {
    parentPort?.postMessage({
      success: false,
      error: 'Invalid file buffer provided.',
    });
    return;
  }

  processCsv(fileBuffer);
});

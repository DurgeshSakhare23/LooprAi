// backend/src/utils/csvGenerator.ts
import { createObjectCsvWriter } from 'csv-writer';
import { v4 as uuid } from 'uuid';
import fs from 'fs';

export interface CsvRow {
  [key: string]: string | number | boolean | null;
}

export const createCSV = async (data: CsvRow[], fields: string[]) => {
  const filePath = `./tmp/${uuid()}.csv`;

  const csvWriter = createObjectCsvWriter({
    path: filePath,
    header: fields.map(f => ({ id: f, title: f })),
  });

  await csvWriter.writeRecords(data.map(row => {
    const filtered: CsvRow = {};
    for (const f of fields) filtered[f] = row[f];
    return filtered;
  }));

  return filePath;
};

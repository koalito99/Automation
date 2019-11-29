import XLSX from 'xlsx';

export default function readFile(file) {
  return new Promise((resolve => {
    const reader = new FileReader();
    const rABS = !!reader.readAsBinaryString;

    reader.onload = (e) => {
      const contents = e.target.result;
      const result = XLSX.read(contents, { type: rABS ? 'binary' : 'array' });
      const sheetName = result.SheetNames[0];
      const sheetData = result.Sheets[sheetName];
      const data = XLSX.utils.sheet_to_json(sheetData, { header: 1 });

      resolve(data);
    };

    rABS ? reader.readAsBinaryString(file) : reader.readAsArrayBuffer(file);
  }));
}

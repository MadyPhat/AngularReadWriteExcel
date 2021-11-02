import { Injectable } from '@angular/core';
import * as FileSaver from 'file-saver';
import * as XLSX from 'xlsx'


const EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
const EXCEL_EXTENSION = '.xlsx';

@Injectable({
  providedIn: 'root'
})
export class ExcelServiceService {

  constructor() { }

  private saveAsExcelFile(data: any, fileName: string): void {
    XLSX.writeFile(data, fileName + ' ' + new Date() + EXCEL_EXTENSION);
  }

  readExcelFile(file: any){
    const workbook = XLSX.read(file, {type: 'binary'});
    const first_sheet_name = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[first_sheet_name];
    return XLSX.utils.sheet_to_json(worksheet, {raw: true});
  }

  exportAsExcelFile(json: any[], excelFileName: string) {
    const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(json);
    const workbook: XLSX.WorkBook = { Sheets: {'data': worksheet}, SheetNames: ['data']};
    this.saveAsExcelFile(workbook, excelFileName);
  }
}

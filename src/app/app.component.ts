import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup } from '@angular/forms';
import * as XLSX from 'xlsx';
import { ExcelServiceService } from './excel-service.service';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  file: any;
  arrayBuffer: any;
  filelist: never[] = [];
  header: [] = [];
  dataForm!: FormGroup;
  displayedColumns: string[] = [];
  dataSource: any;

  constructor(
    private excelService: ExcelServiceService,
    private fb: FormBuilder
  ) { }

  ngOnInit() {
    this.dataForm = this.fb.group({
      fileName: [null],
      formDataArray: this.fb.array(
        [this.createDataForm()]
      )
    })
  }

  createDataForm(): FormGroup {
    return this.fb.group({
      name: [null],
      price: [null]
    })
  }


  get formDataArray(): FormArray {
    return <FormArray> this.dataForm.get('formDataArray')
  }

  addDataForm() {
    this.formDataArray.push(this.createDataForm());
  }

  addfile(event: any) {
    this.file = event.target.files[0];
    let fileReader = new FileReader();
    fileReader.readAsArrayBuffer(this.file);
    fileReader.onload = (e) => {
      this.arrayBuffer = fileReader.result;
      var data = new Uint8Array(this.arrayBuffer);
      var arr = new Array();
      for (var i = 0; i != data.length; ++i) arr[i] = String.fromCharCode(data[i]);
      var bstr = arr.join("");
      this.dataSource = this.excelService.readExcelFile(bstr);
      this.displayedColumns = Object.keys(this.dataSource[0])
      this.filelist = [];
    }
  }

  exportToExcel() {
    this.excelService.exportAsExcelFile(this.dataSource, `Download`);
  }

  submitForm() {
    this.excelService.exportAsExcelFile(this.dataForm.value.formDataArray, this.dataForm.value.fileName);
  }
}

import { PDFDocument } from 'pdf-lib'
import utils from "../utils";
import Vue from 'vue'

async function fillForm(formUrl,payload,joinFileds=[],dataTypes=[]) {
  const formPdfBytes = await fetch(formUrl).then(res => res.arrayBuffer())

  const pdfDoc = await PDFDocument.load(formPdfBytes)

  const form = pdfDoc.getForm()

  scanVars(form,payload,joinFileds,dataTypes);

  const pdfBytes = await pdfDoc.save()
  return pdfBytes;
}

function scanVars(form,payload,joinFileds,dataTypes,prefix="") {
  for(let varName in payload){
    if (!payload[varName]) continue;

    if (joinFileds.includes(varName)) {
      scanVars(form,payload[varName],[],dataTypes,varName+".");
    }
    else {
      if (!form.getFieldMaybe(prefix+varName)) continue;
      
      const field = form.getTextField(prefix+varName);
      const dataType=dataTypes[prefix+varName];
      if (!dataType)
        field.setText(payload[varName].toString());
      else
        field.setText(Vue.filter(dataType)(payload[varName]));
    }
  }
}

async function fill(template,payload,joinFileds,dataTypes) {
  return await fillForm(window.location.origin+"/templates/"+template+".pdf",payload,joinFileds,dataTypes);
}

export const FillService = {
  fill
};

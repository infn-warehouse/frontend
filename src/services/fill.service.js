import { PDFDocument } from 'pdf-lib'

async function fillForm(formUrl,vars) {
  const formPdfBytes = await fetch(formUrl).then(res => res.arrayBuffer())

  const pdfDoc = await PDFDocument.load(formPdfBytes)

  const form = pdfDoc.getForm()

  for(let varName in vars){
    const field = form.getTextField(varName);
    field.setText(vars[varName]);
  }

  const pdfBytes = await pdfDoc.save()
  return pdfBytes;
}

async function fill(template,vars) {
  return await fillForm("./templates/"+template+".pdf",vars);
  
}

export const FillService = {
  fill
};

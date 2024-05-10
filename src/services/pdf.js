import pdf from "pdf-creator-node"
import fs from "fs"
import { fileURLToPath } from "url"
import { dirname, join } from "path"
import { options } from "./options.js"
const _fileName=fileURLToPath(import.meta.url)
const _dirname=dirname(_fileName)

export const createPdf=(users,fileName,req,res)=>{
    const htmlPath=join(_dirname,'../../templets/pdf.html')
   let html=fs.readFileSync(htmlPath,"utf8") 

   let document = {
    html: html,
    data: {users},
    path: `./${fileName}.pdf`,

  }; 
  pdf.create(document,options).then(()=>{
  return res.send(`<a download href="${req.protocol}/${req.headers.host}/${fileName}">download</a>`)
  }) 
}
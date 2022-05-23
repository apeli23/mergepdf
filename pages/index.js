import { PDFDocument } from 'pdf-lib';
import { useState } from 'react';


export default function Home() {

  const [ link, setLink ] = useState('');

  const mergePDF = async () => {
    // Load cover and content PDFs

    const coverBytes = await fetch('https://pdf-lib.js.org/assets/american_flag.pdf').then(res => res.arrayBuffer())
    console.log(typeof coverBytes)
    const cover = await PDFDocument.load(coverBytes);

    const contentBytes = await fetch('https://pdf-lib.js.org/assets/with_update_sections.pdf').then(res => res.arrayBuffer())
    const content = await PDFDocument.load(contentBytes);

    // Create a new Document.
    const doc = await PDFDocument.create();

    // Add cover to the new doc.
    const contentPages1 = await doc.copyPages(cover, cover.getPageIndices());
    for (const page of contentPages1) {
      doc.addPage(page);
    }

    // add individual content pages to the new doc

    const contentPages2 = await doc.copyPages(content, content.getPageIndices());
    for(const page of contentPages2) {
      doc.addPage(page);
    }

    //Upload base64 format
    const pdfBytes = await doc.saveAsBase64({ dataUri: true });
    uploadHandler(pdfBytes)
  }

  const uploadHandler = (file) => {
    console.log(file)
    try {
      fetch('/api/upload', {
        method: 'POST',
        body: JSON.stringify({ data: file }),
        headers: { 'Content-Type': 'application/json' },
      })
        .then((response) => response.json())
        .then((data) => {
          setLink(data.data);
        });
    } catch (error) {
      console.error(error);
    }
  }
  return (
    <div className="container">
      <h2 style={{marginTop: '50px'}}>Merge PDFs with Nextjs</h2>
      {link && <a href="#"><h3 style={{color:"white"}}>view_PDF</h3></a>}
       <div className="row">
         <div className="column">
         <object name="bane" width="400px" height="400px" data="https://pdf-lib.js.org/assets/american_flag.pdf"></object><br />
         PDF_1
         </div>
         <div className="column">
         <object width="400px" height="400px" data="https://pdf-lib.js.org/assets/with_update_sections.pdf"></object><br />
         PDF_2
         </div> 
         <div>
         </div>
       </div>
         <button onClick={mergePDF} className="btn btn-">Merge PDF</button>
    </div>
  )
}

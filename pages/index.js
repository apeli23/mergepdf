import { PDFDocument } from 'pdf-lib';
import { useState } from 'react';


export default function Home() {

  const [link, setLink] = useState('');

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
    for (const page of contentPages2) {
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
      <h2 style={{ marginTop: '50px' }}>Merge PDFs with Nextjs</h2>
      {link && <a href={link}><h3 style={{ color: "white" }}>view_PDF</h3></a>}
      <div className="row">
        <div className="column">
          <a
            href="https://pdf-lib.js.org/assets/american_flag.pdf"
          >
            <img
              title="american flag pdf document: click to view document"
              className='flag' src="https://res.cloudinary.com/dogjmmett/image/upload/v1663941031/Screenshot_2022-09-23_at_16.40.01_zhrd0b.png" /><br />
          </a>
        </div>
        <div className="column">
          <a href="#">
            <img
              title="pdf document sample: click to view document"
              className='flag'
              src="https://res.cloudinary.com/dogjmmett/image/upload/v1663941029/Screenshot_2022-09-23_at_16.40.52_o6wyme.png"
            /><br />
          </a>
        </div>
        <div>
        </div>
      </div>
      <button onClick={mergePDF} className="btn btn-">Merge PDF</button>
    </div>
  )
}

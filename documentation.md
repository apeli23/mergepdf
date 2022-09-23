### Merge PDF docs with Javascript

## Introduction

This article is to demonstrate how separate pdf documents can be merged to a single document using javascript. We will merge a pdf file cotaining an american flag to another pdf document.

## Codesandbox

The final version of this project can be viewed on [Codesandbox](/).

<CodeSandbox
title="webrtc"
id=" "
/>

You can find the full source code on my [Github](/) repo.

## Prerequisites

Basic/entry-level knowledge and understanding of javascript and React/Nextjs.

## Setting Up the Sample Project

Create your project root directory: `npx create-next-app videocall`

Enter the directory: `cd videocall`

We will use [Cloudinary](https://cloudinary.com/?ap=em) online storage feature to store the processed pdf files.

Start by including [Cloudinary](https://cloudinary.com/?ap=em) in your project dependencies: `npm install cloudinary`

### Cloudinary Credentials Setup

Use the following [Link](https://cloudinary.com/console) to create or log into your Cloudinary account. You will be provided with a dashboard containing the necessary environment variables for integration.

In your project root directory, create a new file named `.env.local` and use the following guide to fill your variables.

```
"pages/api/upload.js"


CLOUDINARY_CLOUD_NAME =

CLOUDINARY_API_KEY =

CLOUDINARY_API_SECRET=

```

Restart your project: `npm run dev`.

Create a directory `pages/api/upload.js`.

Configure the environment keys and libraries.

```
"pages/api/upload.js"


var cloudinary = require("cloudinary").v2;

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});
```

Finally, add a handler function to execute Nextjs post request:

```
"pages/api/upload.js"


export default async function handler(req, res) {
    if (req.method === "POST") {
        let url = ""
        try {
            let fileStr = req.body.data;
            const uploadedResponse = await cloudinary.uploader.upload(
                fileStr,
                {
                    resource_type: "video",
                    chunk_size: 6000000,
                }
            );
        } catch (error) {
            res.status(500).json({ error: "Something wrong" });
        }

        res.status(200).json("backend complete");
    }
}
```

The above function will upload media files to Cloudinary and return the file's Cloudinary link as a response

We can now work on our front end.

We will use [PDF-LIB](https://pdf-lib.js.org/) javascript library to achieve our merging. The library is also efficient in many other pdf functionalities as you can check out in the [website](https://pdf-lib.js.org/).

Include `PDF-LIB` in your dependencies: `npm install --save pdf-lib`.

In the `pages/index` directory, add the dependancy to your imports:

```
"pages/index"

import { PDFDocument } from 'pdf-lib';
```

Next, include the following code in your return statement. The css files can be found inside the Github repository.

```
 return (
    <div className="container">
      <h2>Merge PDFs with Nextjs</h2>
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
```

The above code should result in a UI like below

![complete UI](https://res.cloudinary.com/dogjmmett/image/upload/v1663943448/Screenshot_2022-09-23_at_17.29.14_pgsbtu.png 'complete UI')

Let us now include the `mergePdf` function inside the home component.

```
const mergePDF = async() => {

}
```

We will use two pdf documents. Since we are using pdf urls, we begin bu fetching their arrayButffers and loading them to the `cover` and `content` variable respectively.

```
    const mergePDF = async() => {
        const coverBytes = await fetch('https://pdf-lib.js.org/assets/american_flag.pdf').then(res => res.arrayBuffer())
        console.log(typeof coverBytes)
        const cover = await PDFDocument.load(coverBytes);

        const contentBytes = await fetch('https://pdf-lib.js.org/assets/with_update_sections.pdf').then(res => res.arrayBuffer())
        const content = await PDFDocument.load(contentBytes);

    }
```

Create a new PDF document:

```
const mergePDF = async() => {
const coverBytes = await fetch('https://pdf-lib.js.org/assets/american_flag.pdf').then(res => res.arrayBuffer())
console.log(typeof coverBytes)
const cover = await PDFDocument.load(coverBytes);

    const contentBytes = await fetch('https://pdf-lib.js.org/assets/with_update_sections.pdf').then(res => res.arrayBuffer())
    const content = await PDFDocument.load(contentBytes);

    // Create a new Document
    const doc = await PDFDocument.create();
    }

```

We then get the `doc` object and copy the cover pages and get the page indices using the `getPagesIndices` method in form of arrays. We use a for-loop to loop through the pages and add the pages to the initially empty doc object.

```

const mergePDF = async() => {
const coverBytes = await fetch('https://pdf-lib.js.org/assets/american_flag.pdf').then(res => res.arrayBuffer())
console.log(typeof coverBytes)
const cover = await PDFDocument.load(coverBytes);

    const contentBytes = await fetch('https://pdf-lib.js.org/assets/with_update_sections.pdf').then(res => res.arrayBuffer())
    const content = await PDFDocument.load(contentBytes);

// Create a new Document
const doc = await PDFDocument.create();
}

// Add cover to the new doc.
const contentPages1 = await doc.copyPages(cover, cover.getPageIndices());
for (const page of contentPages1) {
doc.addPage(page);
}

```

Use the concept above to add another for loop that concatenates the second pdf to the docs and finally, pass the `base64` format of the result to the uploadHandler function.

```

const mergePDF = async() => {
const coverBytes = await fetch('https://pdf-lib.js.org/assets/american_flag.pdf').then(res => res.arrayBuffer())
console.log(typeof coverBytes)
const cover = await PDFDocument.load(coverBytes);

    const contentBytes = await fetch('https://pdf-lib.js.org/assets/with_update_sections.pdf').then(res => res.arrayBuffer())
    const content = await PDFDocument.load(contentBytes);

    // Create a new Document
    const doc = await PDFDocument.create();
    }

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
```

The upload function will upload the result to to Cloudinary and use a state hook to capture the response and display the link to the user.

Thats it! Ensure to go through the article to enjoy the experience.

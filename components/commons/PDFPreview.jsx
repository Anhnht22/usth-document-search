'use client'

import React, {useState} from 'react'
import {Document, Page, pdfjs} from 'react-pdf'
import {Button} from "@/components/ui/button"
import 'react-pdf/dist/esm/Page/AnnotationLayer.css'
import 'react-pdf/dist/esm/Page/TextLayer.css'

// Set up the worker for react-pdf
pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

export default function PDFViewer({fileUrl}) {
    const [numPages, setNumPages] = useState(null)
    const [pageNumber, setPageNumber] = useState(1)
    const [scale, setScale] = useState(1.0)

    function onDocumentLoadSuccess({numPages}) {
        setNumPages(numPages)
    }

    return (
        <div className="flex flex-col items-center h-full">
            <div className="mb-4 flex-grow overflow-y-auto overflow-x-auto max-w-full">
                <Document
                    file={fileUrl}
                    onLoadSuccess={onDocumentLoadSuccess}
                    loading={<p>Loading PDF...</p>}
                    error={<p>Error loading PDF!</p>}
                >
                    <Page pageNumber={pageNumber} scale={scale}/>
                </Document>
            </div>
            <div className="flex items-center space-x-2 mb-4">
                <Button
                    onClick={() => setPageNumber((prev) => Math.max(prev - 1, 1))}
                    disabled={pageNumber <= 1}
                >
                    Previous
                </Button>
                <span>Page {pageNumber} of {numPages}</span>
                <Button
                    onClick={() => setPageNumber((prev) => Math.min(prev + 1, numPages || 1))}
                    disabled={pageNumber >= (numPages || 1)}
                >
                    Next
                </Button>
            </div>
            {/*<div className="flex items-center space-x-2">*/}
            {/*    <Label htmlFor="scale">Zoom:</Label>*/}
            {/*    <Input*/}
            {/*        id="scale"*/}
            {/*        type="number"*/}
            {/*        min={0.5}*/}
            {/*        max={2}*/}
            {/*        step={0.1}*/}
            {/*        value={scale}*/}
            {/*        onChange={(e) => setScale(parseFloat(e.target.value))}*/}
            {/*        className="w-20"*/}
            {/*    />*/}
            {/*</div>*/}
        </div>
    )
}


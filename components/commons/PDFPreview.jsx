import {Document, Page} from "react-pdf";

export default function PDFPreview({fileUrl}) {
    return (
        <div className="w-full h-screen overflow-auto">
            <Document file={fileUrl}>
                <Page pageNumber={1}/>
            </Document>
        </div>
    );
}

import WordPreview from "@/components/commons/WordPreview";
import ImagePreview from "@/components/commons/ImagePreview";
import {useEffect, useState} from "react";
import PDFPreview from "@/components/commons/PDFPreview";

const PreviewFile = ({fileUrl}) => {
    const [fileType, setFileType] = useState("");

    useEffect(() => {
        const fetchFileType = async () => {
            const response = await fetch(fileUrl, {method: "HEAD"});
            const contentType = response.headers.get("Content-Type");
            setFileType(contentType || "");
        };

        fetchFileType().then(r => r);
    }, [fileUrl]);

    if (fileType.includes("pdf")) {
        return <PDFPreview fileUrl={fileUrl}/>;
    }

    if (fileType.includes("image")) {
        return <ImagePreview fileUrl={fileUrl}/>;
    }

    if (fileType.includes("wordprocessingml")) {
        return <WordPreview fileUrl={fileUrl}/>;
    }

    return <div>File type not allowed.</div>;
};

export default PreviewFile;

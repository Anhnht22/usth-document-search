import React, {useEffect, useState} from "react";
import mammoth from "mammoth";

export default function WordPreview({fileUrl}) {
    const [content, setContent] = useState("");

    useEffect(() => {
        const fetchAndConvert = async () => {
            const response = await fetch(fileUrl);
            const blob = await response.blob();
            const arrayBuffer = await blob.arrayBuffer();

            const result = await mammoth.convertToHtml({arrayBuffer});
            setContent(result.value);
        };

        fetchAndConvert();
    }, [fileUrl]);

    return <div dangerouslySetInnerHTML={{__html: content}} className="prose"/>;
}

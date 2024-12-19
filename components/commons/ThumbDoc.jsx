import {useEffect, useMemo, useState} from "react";
import Image from "next/image";
import {cn} from "@/lib/utils";
import envConfig from "@/utils/envConfig";

import pdfThumbnail from "@/public/thumb-pdf.png";
import docThumbnail from "@/public/thumb-word.png";
import excelThumbnail from "@/public/thumb-excel.png";
import pngThumbnail from "@/public/thumb-png.png";
import jpgThumbnail from "@/public/thumb-jpg.png";
import gifThumbnail from "@/public/thumb-gif.png";
import fileThumbnail from "@/public/thumb-file.png";
import powerpointThumbnail from "@/public/thumb-powerpoint.png";

// https://icons8.com/icon/set/powerpoint/group-color
const fileTypeThumbnails = {
    "application/pdf": pdfThumbnail,
    "application/msword": docThumbnail,
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document": docThumbnail,
    "application/vnd.ms-excel": excelThumbnail,
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": excelThumbnail,
    "application/vnd.ms-powerpoint": powerpointThumbnail,
    "application/vnd.openxmlformats-officedocument.presentationml.presentation": powerpointThumbnail,
    "image/jpeg": jpgThumbnail,
    "image/png": pngThumbnail,
    "image/gif": gifThumbnail,
    default: fileThumbnail,
};

const ThumbDoc = ({file, file_path}) => {
    const fileUrl = useMemo(() => envConfig.endPointStatic + "/" + file_path, [file_path]);

    const [fileType, setFileType] = useState("");
    const [thumbnail, setThumbnail] = useState(fileTypeThumbnails.default);

    useEffect(() => {
        if (file) {
            const contentType = file.type;
            setFileType(contentType || "");
            setThumbnail(fileTypeThumbnails[contentType] || fileTypeThumbnails.default);
        } else {
            const fetchFileType = async () => {
                try {
                    const response = await fetch(fileUrl, {method: "HEAD"});
                    const contentType = response.headers.get("Content-Type");
                    setFileType(contentType || "");
                    setThumbnail(fileTypeThumbnails[contentType] || fileTypeThumbnails.default);
                } catch (error) {
                    console.error("Failed to fetch file type:", error);
                    setThumbnail(fileTypeThumbnails.default);
                }
            };

            fetchFileType().then(r => r);
        }

    }, [fileUrl]);

    return (
        <div className={cn("flex justify-center items-center")}>
            {fileTypeThumbnails[fileType] ? (
                <Image
                    src={thumbnail ?? ""}
                    alt={`Thumbnail for ${fileType}`}
                    className="w-full h-full"
                />
            ) : (
                <div>File <b>{fileType}</b> type not allowed.</div>
            )}
        </div>
    )
}

export default ThumbDoc;
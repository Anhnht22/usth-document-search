import {useState} from "react";
import PreviewFile from "@/components/commons/PreviewFile";
import {Button} from "@/components/ui/button";

const HoverPreviewButton = ({fileUrl}) => {
    const [isHovering, setIsHovering] = useState(false);

    return (
        <div className="relative inline-block">
            {/* Button để mở document */}
            <Button
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                onMouseEnter={() => setIsHovering(true)}
                onMouseLeave={() => setIsHovering(false)}
            >
                Open Document
            </Button>

            {/* Popup hiển thị khi hover */}
            {isHovering && (
                <div
                    className="absolute top-12 left-0 w-64 h-64 overflow-hidden bg-white border border-gray-300 rounded shadow-lg z-10"
                    onMouseEnter={() => setIsHovering(true)} // giữ popup hiển thị khi hover vào popup
                    onMouseLeave={() => setIsHovering(false)} // ẩn popup khi rời khỏi
                >
                    <PreviewFile fileUrl={fileUrl}/>
                </div>
            )}
        </div>
    );
};

export default HoverPreviewButton;

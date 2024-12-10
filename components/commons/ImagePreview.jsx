export default function ImagePreview({fileUrl}) {
    return <img src={fileUrl} alt="Preview" className="max-w-full h-auto" crossOrigin="anonymous"/>;
}

import {File, UploadCloud, X} from 'lucide-react'
import {cn} from "@/lib/utils"
import {Button} from "@/components/ui/button"
import {useFileUpload} from "@/hook/useFileUpload";
import {useEffect} from "react";

export function FileUpload({limit = 1, onFilesChange}) {
    const {files, getRootProps, getInputProps, isDragActive, removeFile} = useFileUpload()

    useEffect(() => {
        if (onFilesChange) onFilesChange(files)
    }, [files, onFilesChange])

    return (
        <div>
            {files.length < limit && (
                <div
                    {...getRootProps()}
                    className={cn(
                        "border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors",
                        isDragActive ? "border-primary" : "border-muted-foreground",
                        "hover:border-primary"
                    )}
                >
                    <input {...getInputProps()} />
                    <UploadCloud className="mx-auto h-12 w-12 text-muted-foreground"/>
                    <p className="mt-2 text-sm text-muted-foreground">
                        Drag and drop files here, or click to select files
                    </p>
                </div>
            )}
            {files.length > 0 && (
                <ul className="mt-2 space-y-2">
                    {files.map((file) => (
                        <li key={file.name} className="flex items-center justify-between p-2 pr-8 bg-muted rounded-md relative">
                            <div className="flex items-center flex-grow w-full">
                                <File className="h-5 w-5 mr-2 text-muted-foreground"/>
                                <span className="text-sm truncate block w-full whitespace-nowrap text-ellipsis">{file.name}</span>
                            </div>
                            <Button
                                type="button"
                                variant="ghost"
                                size="icon"
                                onClick={() => removeFile(file)}
                                className={cn("absolute right-0")}
                            >
                                <X className="h-4 w-4"/>
                                <span className="sr-only">Delete file</span>
                            </Button>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    )
}


import {useCallback, useState} from 'react'
import {useDropzone} from 'react-dropzone'

export function useFileUpload() {
    const [files, setFiles] = useState([])

    const onDrop = useCallback((acceptedFiles) => {
        setFiles(prevFiles => [...prevFiles, ...acceptedFiles])
    }, [])

    const {getRootProps, getInputProps, isDragActive} = useDropzone({onDrop})

    const removeFile = (file) => {
        setFiles(prevFiles => prevFiles.filter(f => f !== file))
    }

    const resetFiles = () => {
        setFiles([])
    }

    return {
        files,
        getRootProps,
        getInputProps,
        isDragActive,
        removeFile,
        resetFiles
    }
}


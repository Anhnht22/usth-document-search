'use client'

import dynamic from 'next/dynamic'

const PDFViewer = dynamic(() => import('./PDFPreview'), {
    ssr: false,
    loading: () => <p>Loading PDF viewer...</p>
})

export default PDFViewer


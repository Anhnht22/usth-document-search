"use client";

import {cn} from "@/lib/utils";
import DocumentSearchLayout from "@/components/commons/document-search/DocumentSearchLayout";
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from "@/components/ui/card";
import {usePathname, useRouter, useSearchParams} from "next/navigation";
import {useDocumentSearch, useDownloadDocument} from "@/hook/useDocument";
import {Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle} from "@/components/ui/dialog";
import PreviewFile from "@/components/commons/PreviewFile";
import envConfig from "@/utils/envConfig";
import {Button} from "@/components/ui/button";
import {useCallback, useEffect, useMemo, useRef, useState} from "react";
import ThumbDoc from "@/components/commons/ThumbDoc";
import {convertFileName} from "@/utils/common";
import ShowType from "@/app/document-search/ShowType";
import SearchForm from "@/app/document-search/SearchForm";

const DocumentSearch = () => {
    const router = useRouter();
    const searchParams = useSearchParams();
    const path = usePathname()

    const subject_id = searchParams.getAll('subject_id') || []
    const department_id = searchParams.getAll('department_id') || []
    const topic_id = searchParams.getAll('topic_id') || []

    const [viewType, setViewType] = useState('grid');
    const [selectedItem, setSelectedItem] = useState(null);
    const [isOpenPreviewDialog, setIsOpenPreviewDialog] = useState(false);
    const [page, setPage] = useState(1);

    const [documentAll, setDocumentAll] = useState([]);

    // {
    //     "document_id": 32,
    //     "file_path": "document/1734057963260-pdf4726010.png",
    //     "title": "Doc 1",
    //     "description": "dde",
    //     "upload_date": 1734060151085,
    //     "status": "APPROVED",
    //     "upload_by": "admin",
    //     "topic_id": 14,
    //     "topic_name": "Top"
    // }
    const defaultParamsRef = useRef({
        limit: 20,
        page: 1,
        active: 1,
        order: JSON.stringify({"t.title": "asc"}),
    })
    const [params, setParams] = useState(null);
    const {data: documentResp, isPending} = useDocumentSearch(params);
    const {total: totalResp} = useMemo(() => documentResp || {}, [documentResp]);
    const {limits, pages, total} = useMemo(() => totalResp || {}, [totalResp]);
    const isNextPage = useMemo(() => pages * limits < total, [limits, pages, total]);

    useEffect(() => {
        if (documentResp?.data) {
            setDocumentAll(prev => [...prev, ...documentResp.data])
            // .filter((v, i, a) => a.findIndex(t => (t.document_id === v.document_id)) === i));
        }
    }, [documentResp]);

    const downloadDocumentMutation = useDownloadDocument()
    const onDownload = useCallback((selectedItem) => {
        downloadDocumentMutation.mutate({
            name: convertFileName(selectedItem.title),
            file: selectedItem.file_path
        });
    }, []);

    const onChangeFilter = (filter) => {
        const params = new URLSearchParams(); // Lấy các params hiện tại
        Object.entries(filter).forEach(([key, value]) => {
            if (Array.isArray(value)) {
                value.forEach((v) => {
                    params.append(key, (v || "") + "");
                });
            } else if (value) {
                params.set(key, (value || "") + "");
            }
        });
        router.replace(path + "?" + params.toString(), {scroll: false});

        setPage(1)
        setDocumentAll([])
        setParams({
            ...defaultParamsRef.current,
            ...filter
        })
    }

    useEffect(() => {
        setParams(prev => ({...prev, page: page}))
    }, [page]);

    const viewListData = useMemo(() => documentAll.map((item) => {
        // {[...documentResp?.data, ...documentResp?.data, ...documentResp?.data, ...documentResp?.data, ...documentResp?.data, ...documentResp?.data, ...documentResp?.data, ...documentResp?.data, ...documentResp?.data, ...documentResp?.data, ...documentResp?.data, ...documentResp?.data, ...documentResp?.data, ...documentResp?.data, ...documentResp?.data, ...documentResp?.data, ...documentResp?.data, ...documentResp?.data, ...documentResp?.data, ...documentResp?.data, ...documentResp?.data]?.map((item) => {
        const {document_id, title, description, file_path} = item;

        return viewType === "row"
            ? (
                <Card
                    key={document_id}
                    className={cn(
                        "flex items-start px-3 py-2 gap-3 w-full",
                        "hover:scale-[1.02] hover:shadow-md hover:cursor-pointer transition"
                    )}
                    onClick={() => {
                        setSelectedItem(item)
                        setIsOpenPreviewDialog(true)
                    }}
                >
                    <div className={cn("w-[35px]")}>
                        <ThumbDoc file_path={file_path}/>
                    </div>
                    <div>
                        <p className={cn("h-[40px] line-clamp-2 font-bold")}>{title}</p>
                        <p className={cn("h-[60px] text-sm line-clamp-3")}>{description}</p>
                    </div>
                </Card>
            ) : (
                <Card
                    key={document_id}
                    className={cn(
                        "hover:scale-[1.02] hover:shadow-md hover:cursor-pointer",
                        "w-full transition",
                    )}
                    onClick={() => {
                        setSelectedItem(item)
                        setIsOpenPreviewDialog(true)
                    }}
                >
                    <CardHeader>
                        <CardTitle>{title}</CardTitle>
                        <CardDescription>{description}</CardDescription>
                    </CardHeader>
                    <CardContent className={cn("flex justify-center")}>
                        <div className={cn("w-[100px] pt-3 pb-10")}>
                            <ThumbDoc file_path={file_path}/>
                        </div>
                    </CardContent>
                </Card>
            )
    }), [documentAll, viewType]);

    return useMemo(() => (
        <DocumentSearchLayout>
            <div className={cn("flex h-full")}>
                <div className={cn("flex-grow flex flex-col h-full overflow-auto")}>
                    <div className={cn("px-4 py-2 flex justify-end gap-2")}>
                        <ShowType onChange={setViewType} defaultValue={viewType}/>
                    </div>
                    <div className="flex-1 py-3 flex flex-col h-full space-y-4">
                        <div
                            className={cn(
                                "grid gap-4 px-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4",
                            )}
                        >
                            {viewListData}
                        </div>
                        <div className={cn("flex justify-center")}>
                            {isNextPage && (<Button
                                disabled={isPending}
                                onClick={() => setPage(page => page + 1)}
                            >
                                Show more
                            </Button>)}
                        </div>
                    </div>
                </div>
                <SearchForm onChangeFilter={onChangeFilter}/>
            </div>

            {selectedItem && (
                <Dialog open={isOpenPreviewDialog} onOpenChange={setIsOpenPreviewDialog}>
                    <DialogContent className={cn("lg:max-w-screen-lg")}>
                        <DialogHeader>
                            <DialogTitle>Document Preview</DialogTitle>
                            <DialogDescription>
                                Preview Document
                            </DialogDescription>
                        </DialogHeader>

                        <div
                            className={cn("relative flex flex-col")}
                            style={{maxHeight: "calc(100dvh - 150px)"}}
                        >
                            <div className={cn("flex-grow overflow-y-auto")}>
                                <PreviewFile fileUrl={envConfig.endPointStatic + "/" + selectedItem.file_path}/>
                            </div>

                            <div
                                className={cn(
                                    "h-[50px] bg-white",
                                    "flex justify-end items-center gap-3 p-3"
                                )}
                            >
                                <Button onClick={() => onDownload(selectedItem)}>
                                    Download
                                </Button>
                            </div>
                        </div>
                    </DialogContent>
                </Dialog>
            )}
        </DocumentSearchLayout>
    ), [documentAll, viewType, isPending, page, viewListData, selectedItem, isOpenPreviewDialog, isNextPage]);
}

export default DocumentSearch;
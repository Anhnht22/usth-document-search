import {
    Pagination,
    PaginationContent,
    PaginationEllipsis,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from "@/components/ui/pagination"
import {cn} from "@/lib/utils";

/**
 * CustomPagination component
 * @param totalPage
 * @param page
 * @param totalRecord
 * @param perPage
 * @param onPageChange
 * @returns {JSX.Element}
 * @constructor
 */
export function CustomPagination({totalPage, page, totalRecord, perPage, onPageChange}) {
    totalPage = totalPage ? totalPage : Math.ceil(totalRecord / perPage);

    const getPageNumbers = () => {
        const pageNumbers = [];
        if (totalPage <= 7) {
            for (let i = 1; i <= totalPage; i++) {
                pageNumbers.push(i)
            }
        } else if (page <= 4) {
            pageNumbers.push(1, 2, 3, 4, 5)
        } else if (page >= totalPage - 3) {
            pageNumbers.push(totalPage - 4, totalPage - 3, totalPage - 2, totalPage - 1, totalPage)
        } else {
            pageNumbers.push(page - 1, page, page + 1)
        }
        return pageNumbers
    }

    const pageNumbers = getPageNumbers();

    return (
        <Pagination className={cn("justify-end")}>
            <PaginationContent>
                <PaginationItem
                    className={cn(
                        page === 1 ? "hover:cursor-not-allowed" : "hover:cursor-pointer"
                    )}
                >
                    <PaginationPrevious
                        onClick={() => onPageChange(Math.max(1, page - 1))}
                        className={page === 1 ? 'pointer-events-none opacity-50' : ''}
                    />
                </PaginationItem>

                {!pageNumbers.includes(1) && (
                    <>
                        <PaginationItem className={cn("hover:cursor-pointer")}>
                            <PaginationLink onClick={() => onPageChange(1)}>1</PaginationLink>
                        </PaginationItem>
                        <PaginationItem>
                            <PaginationEllipsis/>
                        </PaginationItem>
                    </>
                )}

                {pageNumbers.map((num) => (
                    <PaginationItem key={num} className={cn("hover:cursor-pointer")}>
                        <PaginationLink
                            isActive={num === page}
                            onClick={() => onPageChange(num)}
                        >
                            {num}
                        </PaginationLink>
                    </PaginationItem>
                ))}

                {!pageNumbers.includes(totalPage) && (
                    <>
                        <PaginationItem>
                            <PaginationEllipsis/>
                        </PaginationItem>
                        <PaginationItem className={cn("hover:cursor-pointer")}>
                            <PaginationLink onClick={() => onPageChange(totalPage)}>
                                {totalPage}
                            </PaginationLink>
                        </PaginationItem>
                    </>
                )}

                <PaginationItem
                    className={cn(
                        page === totalPage ? "hover:cursor-not-allowed" : "hover:cursor-pointer"
                    )}
                >
                    <PaginationNext
                        onClick={() => onPageChange(Math.min(totalPage, page + 1))}
                        className={page === totalPage ? 'pointer-events-none opacity-50' : ''}
                    />
                </PaginationItem>

            </PaginationContent>
        </Pagination>
    )
}


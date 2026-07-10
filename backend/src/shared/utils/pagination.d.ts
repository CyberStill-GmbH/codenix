export declare function getPagination(pageValue?: unknown, pageSizeValue?: unknown): {
    page: number;
    pageSize: number;
    skip: number;
    take: number;
};
export declare function buildPaginationMeta(page: number, pageSize: number, total: number): {
    page: number;
    pageSize: number;
    total: number;
    totalPages: number;
};
//# sourceMappingURL=pagination.d.ts.map
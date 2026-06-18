export function getPagination(pageValue?: unknown, pageSizeValue?: unknown) {
  const page = Math.max(Number(pageValue ?? 1), 1);
  const pageSize = Math.min(Math.max(Number(pageSizeValue ?? 10), 1), 100);

  return {
    page,
    pageSize,
    skip: (page - 1) * pageSize,
    take: pageSize
  };
}

export function buildPaginationMeta(page: number, pageSize: number, total: number) {
  return {
    page,
    pageSize,
    total,
    totalPages: Math.ceil(total / pageSize)
  };
}

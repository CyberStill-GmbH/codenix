export function asyncHandler(fn) {
    return (req, res, next) => {
        Promise.resolve()
            .then(() => fn(req, res, next))
            .catch(next);
    };
}
//# sourceMappingURL=async-handler.js.map
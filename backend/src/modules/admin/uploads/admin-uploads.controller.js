import { adminUploadsService } from "./admin-uploads.service";
export const adminUploadsController = {
    async uploadImage(req, res) {
        const response = await adminUploadsService.uploadImage(req.file);
        return res.status(201).json(response);
    }
};
//# sourceMappingURL=admin-uploads.controller.js.map
export declare function ensureImagesUploadDir(): Promise<void>;
export declare function assertAllowedImage(file: Express.Multer.File | undefined): asserts file is Express.Multer.File;
export declare function createImageUrl(filename: string): string;
export declare const adminUploadsService: {
    uploadImage(file: Express.Multer.File | undefined): Promise<{
        url: string;
    }>;
};
//# sourceMappingURL=admin-uploads.service.d.ts.map
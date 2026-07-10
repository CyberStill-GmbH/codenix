import { passwordResetService } from "./password-reset.service";
export const passwordResetController = {
    async forgotPassword(req, res) {
        await passwordResetService.forgotPassword(req.body);
        return res.status(204).send();
    },
    async resetPassword(req, res) {
        await passwordResetService.resetPassword(req.body);
        return res.status(204).send();
    }
};
//# sourceMappingURL=password-reset.controller.js.map
import { authService } from "./auth.service";
export const authController = {
    async register(req, res) {
        const session = await authService.register(req.body);
        return res.status(201).json(session);
    },
    async login(req, res) {
        const session = await authService.login(req.body);
        return res.status(200).json(session);
    },
    async me(req, res) {
        const user = await authService.me(req.user.id);
        return res.status(200).json(user);
    },
    async logout(_req, res) {
        return res.status(204).send();
    }
};
//# sourceMappingURL=auth.controller.js.map
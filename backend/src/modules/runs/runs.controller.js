import { runsService } from "./runs.service";
export class RunsController {
    async getRun(req, res) {
        const runId = res.locals.validatedParams.runId;
        const userId = req.user?.id;
        if (!userId) {
            return res.status(401).json({ code: "UNAUTHORIZED", message: "Unauthorized" });
        }
        const run = await runsService.getRunById(runId, userId);
        return res.status(200).json(run);
    }
}
export const runsController = new RunsController();
//# sourceMappingURL=runs.controller.js.map
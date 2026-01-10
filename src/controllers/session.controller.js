import { SessionService } from "../services/session.service.js";

export class SessionController {
  static async list(req, res) {
    const sessions = await SessionService.listSessions(req.user.id);
    res.json(sessions);
  }

  static async revoke(req, res) {
    await SessionService.revokeSession(req.params.id, req.user.id);
    res.status(204).send();
  }

  static async revokeAll(req, res) {
    const refreshToken = req.cookies?.refreshToken || req.body.refreshToken;
    await SessionService.revokeAllExceptCurrent(req.user.id, refreshToken);
    res.status(204).send();
  }
}

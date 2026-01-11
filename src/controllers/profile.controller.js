import { ProfileService } from "#services/profile.service";

export class ProfileController {

  static async get(req, res, next) {
    try {
      const data = await ProfileService.getProfile(req.user.id);
      res.json({ success: true, data });
    } catch (err) {
      next(err);
    }
  }

  static async update(req, res, next) {
  try {
    const data = await ProfileService.updateProfile(
      req.user.id,
      req.body
    );

    res.json({
      success: true,
      message: "Profile updated successfully",
      data,
    });
  } catch (err) {
    next(err);
  }
}

static async delete(req, res, next) {
  try {
    await ProfileService.deleteAccount(req.user.id);

    res.status(200).json({
      success: true,
      message: "Account deleted successfully",
    });
  } catch (err) {
    next(err);
  }
}



}
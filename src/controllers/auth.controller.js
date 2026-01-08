import * as authService from '#services/auth.service';

export const signup = async (req, res) => {
    const user = await authService.signup(req.body);
    res.status(201).json({ ok: true, data: user });
};

export const login = async (req, res) => {
    const data = await authService.login(req.body);
    res.status(200).json({ ok: true, data });
};

export const refresh = async (req, res) => {
    const { refreshToken } = req.body;
    const data = await authService.refresh(refreshToken);
    res.status(200).json({ ok: true, data });
};

export const logout = async (req, res) => {
    const { refreshToken } = req.body;
    // If no refresh token provided, just return success (client might have cleared it)
    if (refreshToken) {
        await authService.logout(refreshToken);
    }
    res.status(200).json({ ok: true, message: 'Logged out successfully' });
};

export const changePassword = async (req, res) => {
    // req.user from auth middleware
    await authService.changePassword(req.user.id, req.body);
    res.status(200).json({ ok: true, message: 'Password changed successfully' });
};

export const forgotPassword = async (req, res) => {
    await authService.forgotPassword(req.body.email);
    // Always return success to prevent enumeration
    res.status(200).json({ ok: true, message: 'If email exists, reset instructions have been sent' });
};

export const resetPassword = async (req, res) => {
    await authService.resetPassword(req.body);
    res.status(200).json({ ok: true, message: 'Password reset successfully' });
};

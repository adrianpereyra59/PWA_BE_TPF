import AuthService from "../services/auth.service.js";

class AuthController {
  static async register(req, res) {
    try {
      const { username, email, password } = req.body;
      if (!username) return res.status(400).json({ ok: false, message: "username requerido" });
      if (!email) return res.status(400).json({ ok: false, message: "email requerido" });
      if (!password || password.length < 6) return res.status(400).json({ ok: false, message: "password demasiado corto" });

      await AuthService.register(username, password, email);
      res.json({ ok: true, message: "Usuario registrado" });
    } catch (err) {
      console.error("register error", err);
      const status = err.status || 500;
      res.status(status).json({ ok: false, message: err.message || "error interno del servidor" });
    }
  }

  static async verifyEmail(req, res) {
    try {
      const { verification_token } = req.params;
      await AuthService.verifyEmail(verification_token);
      return res.redirect((process.env.FRONTEND_URL || process.env.URL_FRONTEND || "") + "/login");
    } catch (err) {
      console.error("verifyEmail error", err);
      const status = err.status || 500;
      res.status(status).json({ ok: false, message: err.message || "error interno del servidor" });
    }
  }

  static async login(req, res) {
    try {
      const { email, password } = req.body;
      const { authorization_token, user } = await AuthService.login(email, password);
      res.json({ ok: true, message: "Logged in", data: { authorization_token, user: { id: user._id, email: user.email, name: user.name } } });
    } catch (err) {
      console.error("login error", err);
      const status = err.status || 500;
      res.status(status).json({ ok: false, message: err.message || "error interno del servidor" });
    }
  }

  static async forgotPassword(req, res) {
    try {
      const { email } = req.body;
      if (!email) return res.status(400).json({ ok: false, message: "email requerido" });
      const result = await AuthService.forgotPassword(email);
      res.json({ ok: true, message: result.message || "Si el correo electrónico existe recibirás instrucciones" });
    } catch (err) {
      console.error("forgotPassword error", err);
      const status = err.status || 500;
      res.status(status).json({ ok: false, message: err.message || "error interno del servidor" });
    }
  }

  static async resetPassword(req, res) {
    try {
      const { token, password } = req.body;
      if (!token || !password) return res.status(400).json({ ok: false, message: "token y contraseña requeridos" });
      const result = await AuthService.resetPassword(token, password);
      res.json({ ok: true, message: result.message || "Contraseña actualizada" });
    } catch (err) {
      console.error("resetPassword error", err);
      const status = err.status || 500;
      res.status(status).json({ ok: false, message: err.message || "error interno del servidor" });
    }
  }
}

export default AuthController;
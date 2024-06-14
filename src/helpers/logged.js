module.exports = {
    logged: function (req, res, next) {
        if (req.isAuthenticated()) {
            return next();
        }
        req.flash('error_msg', 'Usuário não autenticado');
        res.redirect('/dashboard/login');
    }
}
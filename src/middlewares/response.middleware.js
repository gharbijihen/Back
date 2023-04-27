module.exports = class ResponseMiddleware {
    static setup(req, res, next) {
        res.success = (data) => {
            res.status(200).json({ success: true, data });
        };

        next();
    }
};

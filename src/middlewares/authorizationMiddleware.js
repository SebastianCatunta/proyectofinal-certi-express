export function authorize(...allowedRoles) {

  return (req, res, next) => {

    if (!req.user) {
      const error = Error("User not authenticated");
      error.statusCode = 401;
      return next(error);
    }

    if (!allowedRoles.includes(req.user.role)) {
      const error = Error("Access denied");
      error.statusCode = 403;
      return next(error);
    }

    next();
  };

}
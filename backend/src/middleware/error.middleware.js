export const errorHandler = (err, req, res, next) => {
  let status = err.status || 500;
  let message = err.message || "Something went wrong";

  // Mongoose validation error
  if (err.name === "ValidationError") {
    status = 400;
    message = Object.values(err.errors).map(e => e.message).join(", ");
  }
  // Duplicate key error
  if (err.code === 11000) {
    status = 409;
    message = "Email already exists";
  }

  res.status(status).json({
    success: false,
    message
  });
};
module.exports = (res, moduleName, errorCode, message, error) => {
  console.error("Error occured in module: " + moduleName + " - message: " + message + " - original error: " + error);
  if (res) {
    return res.status(errorCode).json({ message });
  }
};
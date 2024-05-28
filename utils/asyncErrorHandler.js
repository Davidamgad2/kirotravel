//this is a middleware function that will wrap the async function in a try/catch block and pass it to the next middleware function.
// If there is an error, it will be passed to the next middleware function, which is the error handler middleware function in this case. 
//This way, we don't have to write try/catch blocks in every async function.
module.exports = (func) => {
  return (req, res, next) => {
    func(req, res, next).catch((err) => next(err));
  };
};

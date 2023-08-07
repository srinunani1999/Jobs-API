const { CustomAPIError } = require('../errors')
const { StatusCodes } = require('http-status-codes')
const errorHandlerMiddleware = (err, req, res, next) => {
  let customError={
    statusCode: err.statusCode || StatusCodes.INTERNAL_SERVER_ERROR,
    msg:err.message || 'Something went wrong.'
  }
  // if (err instanceof CustomAPIError) {
  //   return res.status(err.statusCode).json({ msg: err.message })
  // }

  if (err.name === 'ValidationError') {
    customError.statusCode= StatusCodes.BAD_REQUEST
     customError.msg= Object.values(err.errors).map((item)=>item.message).join(', ');
  }
  if (err.name === 'CastError') {
    customError.statusCode= StatusCodes.NOT_FOUND;
    customError.msg= `No item found with value ${err.value}`;
  }
  if (err.code && err.code === 11000) {
    customError.statusCode= StatusCodes.BAD_REQUEST,
    customError.msg= `Duplicate value found with ${Object.keys(err.keyValue)}. Please use another value.`;
  }
  return res.status(customError.statusCode).send( customError.msg )
}

module.exports = errorHandlerMiddleware

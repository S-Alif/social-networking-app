// async handler function to reduce writing try catch blocks every time

module.exports = (fn) => {
  return async (...args) => {
    try {
      return await fn(...args)
    } catch (error) {
      console.error(error); 
      return {status: 0, code: 200, data: "something went wrong"}
    }
  }
} 
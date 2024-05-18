// async handler function to reduce writing try catch blocks every time

module.exports = (fn) => {
  return async (req) => {
    try {
      return await fn(req)
    } catch (error) {
      console.error(error); 
      return {status: 0, code: 200, data: "something went wrong"}
    }
  }
} 
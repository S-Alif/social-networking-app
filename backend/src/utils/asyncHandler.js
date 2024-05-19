// async handler function to reduce writing try catch blocks every time

module.exports = async (fn) => {
  try {
    let result = await fn()
    return result
  } catch (error) {
    console.error(error);
    return { status: 0, code: 200, data: "something went wrong" }
  }
} 
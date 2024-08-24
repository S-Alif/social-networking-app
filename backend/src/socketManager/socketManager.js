let ioInstance = null
let findSocketIdInstance = null

const setSocketInstance = (io, findSocketId) => {
  ioInstance = io;
  findSocketIdInstance = findSocketId
}

const getIoInstance = () => ioInstance
const getFindSocketIdInstance = () => findSocketIdInstance

module.exports = {
  setSocketInstance,
  getIoInstance,
  getFindSocketIdInstance,
}

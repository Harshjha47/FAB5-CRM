let ioInstance = null;

module.exports = {
  init: (io) => {
    ioInstance = io;
  },
  
  /**
   * Broadcast data changes globally or to specific roles
   * @param {string} event - The channel name (e.g., 'connection_changed')
   * @param {object} payload - Action type ('CREATE'/'UPDATE'/'DELETE') and target identifiers
   */
  broadcastChange: (event, payload) => {
    if (ioInstance) {
      ioInstance.emit(event, payload);
    }
  }
};
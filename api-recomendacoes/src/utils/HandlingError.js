module.exports = {
  handlingError(error) {
    if (error.response) {
      console.error(new Error(`${error.response.status}: ${error.response.data}`));
    } else if (error.request) {
      console.error(new Error(`No response from ${error.request._currentUrl}`));
    } else {
      console.error(new Error(`${error.message}`));
    }
  }
}
export const getApiErrorMessage = (error, fallback = "Something went wrong.") => {
  if (error?.response?.data?.errors?.length) {
    return error.response.data.errors[0].msg || fallback;
  }

  if (error?.response?.data?.message) {
    return error.response.data.message;
  }

  if (error?.code === "ERR_NETWORK") {
    return "Unable to reach the server. Verify the deployed API URL and backend CORS settings, then try again.";
  }

  return fallback;
};

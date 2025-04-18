export const usernameValidator = (username) => {
  const usernameRegex = /^[a-zA-Z0-9.\-@#$]{1,17}$/;

  if (!usernameRegex.test(username)) {
    return { isValid: false, errorMessage: "Username is Invalid" };
  }

  return { isValid: true };
};

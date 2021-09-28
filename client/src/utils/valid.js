const valid = ({ email, password, fullName, username, gender, confirmPassword }) => {
  const err = {};
  function validateEmail(email) {
    const re =
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
  }

  if (!fullName) {
    err.fullName = 'Please add your full name.';
  } else if (fullName.length <= 1) {
    err.fullName = 'Full name must be at least 2 characters.';
  } else if (fullName.length > 20) {
    err.fullName = 'Maximum characters is 20.';
  }

  if (!username) {
    err.username = 'Please add your full name.';
  } else if (username.replace(/ /g, '').length > 20) {
    err.username = 'Maximum characters is 20.';
  }

  if (!email) {
    err.email = 'Please add your email.';
  } else if (!validateEmail(email)) {
    err.email = 'Email format is incorrect.';
  }

  if (!password) {
    err.password = 'Please add your password.';
  } else if (password.length < 6) {
    err.password = 'Password must be at least 6 characters.';
  }

  if (password !== confirmPassword) {
    err.confirmPassword = 'Confirm password did not match.';
  }

  return {
    errMsg: err,
    errLength: Object.keys(err).length,
  };
};

export default valid;

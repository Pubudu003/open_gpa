/*
 * Test Utilities for OPEN GPA Test Automation
 */

/*
 * Generates a unique test user payload with a dynamic timestamp.
 * Example email: qa_student_1722345678@gpa-test.com
 */

export const generateUniqueUser = (customRole = "student") => {
  const timestamp = Date.now();
  const randomNum = Math.floor(Math.random() * 1000);

  return {
    userName: `QA_Student_${timestamp}`,
    email: `qa_student_${timestamp}_${randomNum}@gpa-test.com`,
    password: "Password123!",
    confirmPassword: "Password123!",
    role: customRole,
  };
};

/*
 * Extracts specific cookies from Set-Cookie response header array
 */

export const parseCookies = (setCookieHeader) => {
  if (!setCookieHeader) return {};
  const cookies = {};

  // setCookieHeader can be a string or array of header strings
  const headerArray = Array.isArray(setCookieHeader)
    ? setCookieHeader
    : [setCookieHeader];

  headerArray.forEach((cookieStr) => {
    const parts = cookieStr.split(";")[0].split("=");
    if (parts.length === 2) {
      cookies[parts[0].trim()] = parts[1].trim();
    }
  });

  return cookies;
};

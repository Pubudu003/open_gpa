import { test, expect } from "@playwright/test";
import { generateUniqueUser } from "../utils/test-helpers.js";

test.describe("Module 1: User Sign-Up API Tests (/api/auth/signup)", () => {
  // -----------------------------------------------
  // TC_SIGNUP_001: User Registration (Signup) & Full Safe User Verification
  // -----------------------------------------------
  test("TC_SIGNUP_001: Should successfully register a new student user with valid data and return a full safe user", async ({
    request,
  }) => {
    const newUser = generateUniqueUser();

    const response = await request.post("/api/auth/signup", {
      data: {
        userName: newUser.userName,
        email: newUser.email,
        password: newUser.password,
      },
    });

    // 1. Assert HTTP Status Code 201 Created
    expect(response.status()).toBe(201);

    // 2. Assert Response Body Structure
    const body = await response.json();
    expect(body.success).toBe(true);
    expect(body.message).toContain("You have successfully signed up");
    expect(body.user).toBeDefined();

    // 3. Assert Safe User Object Properties
    const user = body.user;
    expect(user._id).toBeDefined();
    expect(user.userName).toBe(newUser.userName);
    expect(user.email).toBe(newUser.email.toLowerCase());
    expect(user.role).toBe("student"); // Default role
    expect(user.isVerified).toBe(false); // Default isVerified status
    expect(user.degree).toBeUndefined();
    expect(user.gpa).toBe(0); // Default gpa
    expect(user.totalCredits).toBe(0); // Default totalCredits
    expect(Array.isArray(user.courses)).toBe(true); // Empty courses array

    // 4. CRITICAL SECURITY ASSERTION: Password MUST NOT be present
    expect(user.password).toBeUndefined();

    // 5. Assert Set-Cookie Headers (accessToken & refreshToken)
    const setCookieHeaders = response.headers()["set-cookie"];
    expect(setCookieHeaders).toBeDefined();
    expect(setCookieHeaders).toContain("accessToken=");
    expect(setCookieHeaders).toContain("refreshToken=");
  });

  // -----------------------------------------------
  // TC_SIGNUP_002: Field Validation - Missing Required Fields
  // -----------------------------------------------

  const missingFieldScenarios = [
    {
      name: "Missing userName",
      payload: {
        email: "test123@example.com",
        password: "Password123!",
      },
    },
    {
      name: "Missing email",
      payload: {
        userName: "Test123User",
        password: "Password123!",
      },
    },
    {
      name: "Missing password",
      payload: {
        userName: "Test123User",
        email: "test123@example.com",
      },
    },
  ];

  for (const scenario of missingFieldScenarios) {
    test(`TC_SIGNUP_002: Should return 400 when ${scenario.name}`, async ({
      request,
    }) => {
      const response = await request.post("/api/auth/signup", {
        data: scenario.payload,
      });

      expect(response.status()).toBe(400);

      const body = await response.json();
      expect(body.success).toBe(false);
      expect(body.errorCode).toBe("MISSING_REQUIRED_FIELDS");
      expect(body.message).toBe("All fields are required");
    });
  }

  // -----------------------------------------------
  // TC_SIGNUP_003: Duplicate Check - Existing Email
  // -----------------------------------------------
  test("TC-SIGNUP_003: Should reject registration with an existing email", async ({
    request,
  }) => {
    const existingUser = generateUniqueUser();

    // First signup: Creation succeeds
    const firstAttempt = await request.post("/api/auth/signup", {
      data: {
        userName: existingUser.userName,
        email: existingUser.email,
        password: existingUser.password,
      },
    });
    expect(firstAttempt.status()).toBe(201);

    // Second signup: Duplicate email attempt
    const secondAttempt = await request.post("api/auth/signup", {
      data: {
        userName: "DuplicateUser",
        email: existingUser.email, // same email
        password: "password123",
      },
    });

    expect(secondAttempt.status()).toBe(400);

    const body = await secondAttempt.json();
    expect(body.success).toBe(false);
    expect(body.errorCode).toBe("USER_ALREADY_EXISTS");
    expect(body.message).toBe("User already exists");
  });

  // -----------------------------------------------
  // TC_SIGNUP_004: Password Minlength Validation
  // -----------------------------------------------
  test("TC_SIGNUP_004: Should fail when password length is less than 8 characters", async ({
    request,
  }) => {
    const newUser = generateUniqueUser();

    const response = await request.post("/api/auth/signup", {
      data: {
        userName: newUser.userName,
        email: newUser.email,
        password: "12345", // less than 8 characters
      },
    });

    expect(response.status()).toBeGreaterThanOrEqual(400);

    const body = await response.json();
    expect(body.success).toBe(false);
  });

  // ---------------------------------------------------
  // TC_SIGNUP_007: Complete Data Sanitization Assertion
  // ---------------------------------------------------
  test("TC_SIGNUP_007: Should verify full safeUser schema is populated without leaking credentials", async ({
    request,
  }) => {
    const newUser = generateUniqueUser();

    const response = await request.post("/api/auth/signup", {
      data: {
        userName: newUser.userName,
        email: newUser.email,
        password: newUser.password,
      },
    });

    const body = await response.json();
    const user = body.user;

    expect(user).toHaveProperty("_id");
    expect(user).toHaveProperty("userName");
    expect(user).toHaveProperty("email");
    expect(user).toHaveProperty("role");
    expect(user).toHaveProperty("isVerified");
    expect(user).toHaveProperty("gpa");
    expect(user).toHaveProperty("totalCredits");
    expect(user).toHaveProperty("courses");

    // Key that MUST NOT exist in safeUser
    expect(user.password).toBeUndefined();
  });
});

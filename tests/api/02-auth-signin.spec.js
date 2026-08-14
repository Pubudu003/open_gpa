import dotenv from "dotenv";
import { test, expect } from "@playwright/test";
import { generateUniqueUser, parseCookies } from "../utils/test-helpers";
import { redis } from "../../backend/lib/redis.js";
import User from "../../backend/models/user.model.js";
import { connectDB, disconnectDB } from "../../backend/lib/db.js";

test.describe("Module 2: User Sign-in API Tests (/api/auth/signin)", () => {
  let unverifiedStudent;
  let verifiedStudent;
  let verifiedAdmin;

  // ------------------------------------------------------------
  // Setup Hook: Register test accounts before running sing-in assertions
  // ------------------------------------------------------------
  test.beforeAll(async ({ request }) => {
    // Connect to MongoDB
    try {
      dotenv.config();
      process.env.NODE_ENV = "test";
      const conn = await connectDB();
    } catch (error) {
      console.log("Error connecting to the DB:", error.message);
      process.exit(1);
    }

    // 1. Create an Unverified Student Account
    unverifiedStudent = generateUniqueUser();
    const res1 = await request.post("/api/auth/signup", {
      data: {
        userName: unverifiedStudent.userName,
        email: unverifiedStudent.email,
        password: unverifiedStudent.password,
      },
    });
    expect(res1.status()).toBe(201);

    // 2. Create another user that will represent a Verified Student Account
    verifiedStudent = generateUniqueUser();
    const res2 = await request.post("/api/auth/signup", {
      data: {
        userName: verifiedStudent.userName,
        email: verifiedStudent.email,
        password: verifiedStudent.password,
      },
    });

    // change the isVerified from default(false) to true value for verifiedStudent.
    await User.updateOne(
      { email: verifiedStudent.email },
      { isVerified: true },
    );
    expect(res2.status()).toBe(201);

    // 3. Create third user that will represent Verified Admin Account
    verifiedAdmin = generateUniqueUser();
    const res3 = await request.post("/api/auth/signup", {
      data: {
        userName: verifiedAdmin.userName,
        email: verifiedAdmin.email,
        password: verifiedAdmin.password,
      },
    });

    // Change the isVerified = true and role = admin
    await User.updateOne(
      { email: verifiedAdmin.email },
      { isVerified: true, role: "admin" },
    );
    expect(res3.status()).toBe(201);
  });

  test.afterAll(async () => {
    // Disconnect from MongoDB
    try {
      await disconnectDB();
    } catch (error) {
      console.log("Error disconnecting from the DB:", error.message);
      process.exit(1);
    }
  });

  // ------------------------------------------------------------
  // TC_SIGNIN_001: Verified Student Sign-in
  // ------------------------------------------------------------
  test("TC_SIGNIN_001: Verified user login should return 200 with successfully logged in message", async ({
    request,
  }) => {
    // Assuming verifiedStudent account has isVerified === true
    const response = await request.post("/api/auth/signin", {
      data: {
        email: verifiedStudent.email,
        password: verifiedStudent.password,
      },
    });

    expect(response.status()).toBe(200);

    const body = await response.json();
    expect(body.success).toBe(true);
    expect(body.user).toBeDefined();

    // verified user message check
    expect(body.message).toBe("You have successfully logged in");
  });

  // ------------------------------------------------------------
  // TC_SIGNIN_002: Unverified Student Sign-in
  // ------------------------------------------------------------
  test("TC_SIGNIN_002: Unverified user login should return 200 with check your email to verify message", async ({
    request,
  }) => {
    // unverifiedStudent account has isVerified === true
    const response = await request.post("/api/auth/signin", {
      data: {
        email: unverifiedStudent.email,
        password: unverifiedStudent.password,
      },
    });

    expect(response.status()).toBe(200);

    const body = await response.json();
    expect(body.success).toBe(true);
    expect(body.user).toBeDefined();

    // Unverified user message check
    expect(body.message).toBe("Check your email to verify your account");
  });

  // ------------------------------------------------------------
  // TC_SIGNIN_003: Verified Admin Sign-in
  // ------------------------------------------------------------
  test("TC_SIGNIN_003: Admin user login should return 200 with successfully logged in message", async ({
    request,
  }) => {
    // Verified Admin account has isVerified = true, and role = "admin"
    const response = await request.post("/api/auth/signin", {
      data: {
        email: verifiedAdmin.email,
        password: verifiedAdmin.password,
      },
    });

    expect(response.status()).toBe(200);

    const body = await response.json();
    expect(body.success).toBe(true);
    expect(body.user).toBeDefined();

    // Verified user message check
    expect(body.message).toBe("You have successfully logged in");
  });

  // ------------------------------------------------------------
  // TC_SIGNIN_004: Field validation - Missing email/password
  // ------------------------------------------------------------
  const missingFieldScenarios = [
    { name: "Missing Email", payload: { password: "Password123!" } },
    { name: "Missing Password", payload: { email: "student123@example.com" } },
    { name: "Missing Both Email and Password", payload: {} },
  ];

  for (const scenario of missingFieldScenarios) {
    test(`TC_SIGNIN_004: Should return 400 when submitting (${scenario.name})`, async ({
      request,
    }) => {
      const response = await request.post("/api/auth/signin", {
        data: scenario.payload,
      });

      expect(response.status()).toBe(400);

      const body = await response.json();
      expect(body.success).toBe(false);
      expect(body.errorCode).toBe("MISSING_REQUIRED_FIELDS");
      expect(body.message).toBe("All fields are required");
    });
  }

  // ------------------------------------------------------------
  // TC_SIGNIN_005: Invalid / Unregistered email
  // ------------------------------------------------------------
  test("TC_SIGNIN_005: Should return 401 when email is not registered in system", async ({
    request,
  }) => {
    const response = await request.post("/api/auth/signin", {
      data: {
        email: "nonexistent999@example.com",
        password: "Password123!",
      },
    });

    expect(response.status()).toBe(401);

    const body = await response.json();
    expect(body.success).toBe(false);
    expect(body.errorCode).toBe("INVALID_EMAIL_OR_PASSWORD");
    expect(body.message).toBe("Invalid email or Password");
  });

  // ------------------------------------------------------------
  // TC_SIGNIN_006: Correct email with wrong password
  // ------------------------------------------------------------
  test("TC_SIGNIN_006: Should return 401 when registered email with incorrect password", async ({
    request,
  }) => {
    const response = await request.post("/api/auth/signin", {
      data: {
        email: unverifiedStudent.email,
        password: "IncorrectPassword999!",
      },
    });

    expect(response.status()).toBe(401);

    const body = await response.json();
    expect(body.success).toBe(false);
    expect(body.errorCode).toBe("INVALID_EMAIL_OR_PASSWORD");
    expect(body.message).toBe("Invalid email or Password");
  });

  // ------------------------------------------------------------
  // TC_SIGNIN_007: Email Case Insensitivity and Whitespace Trimming
  // ------------------------------------------------------------
  test("TC_SIGNIN_007: Should successfully sign in when email contains uppercase letters or spaces", async ({
    request,
  }) => {
    const formattedEmail = ` ${unverifiedStudent.email.toUpperCase()} `;

    const response = await request.post("/api/auth/signin", {
      data: {
        email: formattedEmail,
        password: unverifiedStudent.password,
      },
    });

    expect(response.status()).toBe(200);

    const body = await response.json();
    expect(body.success).toBe(true);
    expect(body.user.email).toBe(unverifiedStudent.email.toLowerCase());
  });

  // ------------------------------------------------------------
  // TC_SIGNIN_008: Security payload assertion - Password omission
  // ------------------------------------------------------------
  test("TC_SIGNIN_008: Should strictly exclude password hash from JSON user payload", async ({
    request,
  }) => {
    const response = await request.post("/api/auth/signin", {
      data: {
        email: unverifiedStudent.email,
        password: unverifiedStudent.password,
      },
    });

    const body = await response.json();
    const user = body.user;

    // Verify safeUser object fields
    expect(user).toHaveProperty("_id");
    expect(user).toHaveProperty("userName");
    expect(user).toHaveProperty("email");
    expect(user).toHaveProperty("isVerified");
    expect(user).toHaveProperty("courses");
    expect(user).toHaveProperty("gpa");
    expect(user).toHaveProperty("totalCredits");
    expect(user).toHaveProperty("role");

    // PASSWORD MUST NOT BE PRESENT
    expect(user.password).toBeUndefined();
  });

  // ------------------------------------------------------------
  // TC_SIGNIN_009: Cookie flag Assertion (accessToken & refreshToken)
  // ------------------------------------------------------------
  test("TC_SIGNIN_009: Should issue http-only accessToken and refreshToken cookies", async ({
    request,
  }) => {
    const response = await request.post("/api/auth/signin", {
      data: {
        email: unverifiedStudent.email,
        password: unverifiedStudent.password,
      },
    });

    const setCookieHeader = response.headers()["set-cookie"];
    expect(setCookieHeader).toBeDefined();

    // Verify presence of both security cookies
    expect(setCookieHeader).toContain("accessToken=");
    expect(setCookieHeader).toContain("refreshToken=");

    // AccessToken present with 15m expiry
    expect(setCookieHeader).toMatch(/accessToken=.*HttpOnly/i);
    expect(setCookieHeader).toMatch(/Max-Age=900/);

    // RefreshToken present with 7d expiry
    expect(setCookieHeader).toMatch(/refreshToken=.*HttpOnly/i);
    expect(setCookieHeader).toMatch(/Max-Age=604800/);
  });

  // ------------------------------------------------------------
  // TC_SIGNIN_010: Redis refreshToken storage and expiration assertion
  // ------------------------------------------------------------
  test("TC_SIGNIN_010: Should store refresh token in Redis under refresh_token<userId> with 7-day TTL", async ({
    request,
  }) => {
    // 1. Sign-Up a refresh user
    const testUser = generateUniqueUser();
    const signupRes = await request.post("/api/auth/signup", {
      data: {
        userName: testUser.userName,
        email: testUser.email,
        password: testUser.password,
      },
    });

    expect(signupRes.status()).toBe(201);

    const signupBody = await signupRes.json();
    const userId = signupBody.user._id;

    // 2. Perform Sign_In
    const signinRes = await request.post("/api/auth/signin", {
      data: {
        email: testUser.email,
        password: testUser.password,
      },
    });

    expect(signinRes.status()).toBe(200);

    // 3. Extract the refresh token cookie value from response header

    //const setCookieHeader = signinRes.headers()["set-cookie"];

    const rawHeaders = signinRes.headersArray();
    const setCookieHeaders = rawHeaders
      .filter((h) => h.name.toLocaleLowerCase() === "set-cookie")
      .map((h) => h.value);
    const cookies = parseCookies(setCookieHeaders);
    const issuedRefreshToken = cookies["refreshToken"];
    expect(issuedRefreshToken).toBeDefined();

    // 4. Query Redis directly for key 'refresh_token:<userId>'
    const redisKey = `refresh_token:${userId}`;
    const storedRefreshToken = await redis.get(redisKey);
    const ttlSeconds = await redis.ttl(redisKey);

    // 5. Assertions:
    // A. Token in redis MUST match the token sent in HTTP-ONLY cookie
    expect(storedRefreshToken).toBe(issuedRefreshToken);

    // B. TTL MUST be ~604800 seconds (7 days)
    expect(ttlSeconds).toBeGreaterThan(600000); // Greater than 6 days
    expect(ttlSeconds).toBeLessThanOrEqual(604800); // Less than or equal to 7 days
  });
});

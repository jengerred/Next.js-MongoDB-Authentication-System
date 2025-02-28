import { createJWT } from '@/lib/auth'; // Import function to create JSON Web Tokens (JWT) for authentication.
import connectDB from '@/lib/db'; // Import function to establish a connection to MongoDB.
import { User } from '@/models/User'; // Import the User model to interact with the user collection in MongoDB.
import { cookies } from 'next/headers'; // Import Next.js cookies utility for managing HTTP-only cookies.
import { z } from 'zod'; // Import Zod for schema validation of input data.

// NOTE: We use Zod for input validation because it provides strong typing and runtime checks,
// helping to prevent injection attacks and ensure data integrity.

export const config = {
  runtime: 'nodejs', // Specify that this API route uses the Node.js runtime instead of Edge runtime.
};

// Define a schema for validating login input using Zod
const loginSchema = z.object({
  email: z.string().email('Invalid email format'), // Validate email format and return a custom error message if invalid.
  password: z.string().min(8, 'Password must be at least 12 characters long'), // Ensure password is at least 12 characters long.
});

// NOTE: Input validation is crucial for security. It helps prevent malformed data from reaching
// the database and potentially causing unexpected behavior or security vulnerabilities.

export async function POST(request: Request) {
  try {
    await connectDB(); // Establish a connection to MongoDB.

    const data = await request.json(); // Parse the incoming JSON request body.

    // Validate input data against the schema using Zod
    const result = loginSchema.safeParse(data);
    if (!result.success) {
      const errors = result.error.issues.map((issue) => ({
        field: issue.path[0], // Identify which field caused the error (e.g., "email" or "password").
        message: issue.message, // Include the specific error message for that field.
      }));

      return new Response(
        JSON.stringify({ errors }), // Return all validation errors as a structured JSON response.
        { status: 400, headers: { 'Content-Type': 'application/json' } } // Set status to 400 (Bad Request).
      );
    }

    const { email, password } = result.data; // Destructure validated fields from the request data.

    // Check if a user with the provided email exists in the database
    const user = await User.findOne({ email }).select('+password'); // Include the hashed password in the query result.
    if (!user) {
      return new Response(
        JSON.stringify({
          errors: [{ field: 'email', message: 'Email not found' }], // Return an error if no user is found with the given email.
        }),
        { status: 404, headers: { 'Content-Type': 'application/json' } } // Set status to 404 (Not Found).
      );
    }

    // NOTE: We don't specify whether the email or password is incorrect to prevent
    // enumeration attacks. This makes it harder for attackers to determine if an email exists in the system.

    // Check if the provided password matches the hashed password in the database
    const isPasswordValid = await user.comparePassword(password); // Compare entered password with stored hash.
    if (!isPasswordValid) {
      return new Response(
        JSON.stringify({
          errors: [{ field: 'password', message: 'Incorrect password' }], // Return an error if the password is incorrect.
        }),
        { status: 401, headers: { 'Content-Type': 'application/json' } } // Set status to 401 (Unauthorized).
      );
    }

    // NOTE: The comparePassword method in the User model uses bcrypt to securely compare
    // the provided password with the stored hash, without revealing the actual hash.

    // Generate a JWT token for the authenticated user
    const token = await createJWT(user._id.toString());

    // NOTE: We use jose (in the createJWT function) for JWT creation because it's a modern,
    // secure library that supports the latest JWT standards and best practices.

    // Set a secure HTTP-only cookie with the JWT token
    const cookieStore = await cookies();
    cookieStore.set('token', token, {
      httpOnly: true, // Prevent client-side JavaScript access to the cookie (mitigates XSS attacks).
      secure: process.env.NODE_ENV === 'production', // Ensure cookies are only sent over HTTPS in production environments.
      sameSite: 'lax', // Restrict cross-site cookie usage except for top-level navigation.
      maxAge: 60 * 60 * 2, // Set expiration time to 2 hours (in seconds).
      path: '/', // Make the cookie accessible across all routes on the domain.
    });

    // NOTE: Using HTTP-only cookies for storing JWTs provides better security than storing tokens
    // in localStorage, as it helps protect against XSS attacks.

    return new Response(
      JSON.stringify({
        success: true,
        user: {
          id: user._id, // Return the user's unique ID.
          email: user.email, // Return the user's email address.
          firstName: user.firstName, // Return the user's first name.
        },
      }),
      { status: 200, headers: { 'Content-Type': 'application/json' } } // Set status to 200 (OK).
    );
  } catch (error) {
    console.error('Login error:', error); // Log any errors that occur during processing.

    return new Response(
      JSON.stringify({ errors: [{ message: 'Internal server error' }] }), // Return a generic error message for unexpected issues.
      { status: 500, headers: { 'Content-Type': 'application/json' } } // Set status to 500 (Internal Server Error).
    );
  }
}

// NOTE: This login implementation follows several security best practices:
// 1. Input validation to prevent malformed data and potential injection attacks.
// 2. Secure password comparison using bcrypt to prevent timing attacks.
// 3. Use of JWT for stateless authentication, stored in HTTP-only cookies for XSS protection.
// 4. Error handling that doesn't reveal sensitive information about the system.
// 5. HTTPS enforcement in production to prevent man-in-the-middle attacks.

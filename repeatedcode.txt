"use client";
import { signIn } from "next-auth/react";
import { useState, FormEvent } from "react";

export default function SignIn() {
    const [phone, setPhone] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const [error, setError] = useState<string>("");

    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setError("");

        const result = await signIn("credentials", {
            redirect: false,
            phone,
            password,
        });

        if (result?.error) {
            setError(result.error); 
        } else if (result?.ok) {
            window.location.href = "/"; 
        }
    };

    return (
        <div className="flex items-center justify-center h-screen bg-gray-100">
            <div className="w-full max-w-md p-8 bg-white rounded-xl shadow-lg">
                <h1 className="text-3xl font-semibold mb-6 text-center text-gray-800">
                    Sign in
                </h1>
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                            Phone number
                        </label>
                        <input
                            type="text"
                            id="phone"
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                            className="block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="1234567890"
                            required
                        />
                    </div>
                    <div>
                        <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                            Password
                        </label>
                        <input
                            type="password"
                            id="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                            required
                        />
                    </div>
                    {error && (
                        <div className="text-red-500 text-sm mt-2">
                            {error}
                        </div>
                    )}
                    <button
                        type="submit"
                        className="w-full py-3 px-4 bg-blue-600 text-white rounded-lg shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                        Sign In
                    </button>
                </form>
            </div>
        </div>
    );
}




// "use client";
// import { signIn } from "next-auth/react";
// import { useState, FormEvent } from "react";
// import { z, ZodError } from "zod";

// // Define Zod schema for validation
// const signInSchema = z.object({
//     phone: z.string().regex(/^\d+$/, "Phone number must be numeric").min(10, "Phone number must be at least 10 digits").max(15, "Phone number must be at most 15 digits"),
//     password: z.string()
//         .min(8, "Password must be at least 8 characters long")
//         .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
//         .regex(/[a-z]/, "Password must contain at least one lowercase letter")
//         .regex(/[!@#$%^&*(),.?":{}|<>]/, "Password must contain at least one special character"),
// });

// export default function SignIn() {
//     const [phone, setPhone] = useState<string>("");
//     const [password, setPassword] = useState<string>("");
//     const [error, setError] = useState<string>("");

//     const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
//         event.preventDefault();
//         setError("");

//         try {
//             // Validate form data
//             signInSchema.parse({ phone, password });

//             // Attempt to sign in using the credentials provider
//             const result = await signIn("credentials", {
//                 redirect: false, // Prevent automatic redirect
//                 phone,
//                 password,
//             });

//             if (result?.error) {
//                 setError(result.error); // Set error message
//             } else if (result?.ok) {
//                 window.location.href = "/"; // Redirect to home page on success
//             }
//         } catch (err) {
//             if (err instanceof ZodError) {
//                 // Set error message from Zod validation
//                 setError(err.errors.map(e => e.message).join(", "));
//             } else {
//                 // Handle other errors
//                 setError("An unexpected error occurred");
//             }
//         }
//     };

//     const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//         // Allow only numeric input
//         const value = e.target.value.replace(/\D/g, "");
//         setPhone(value);
//     };

//     return (
//         <div className="flex items-center justify-center h-screen bg-gray-100">
//             <div className="w-full max-w-md p-8 bg-white rounded-xl shadow-lg">
//                 <h1 className="text-3xl font-semibold mb-6 text-center text-gray-800">
//                     Sign in
//                 </h1>
//                 <form onSubmit={handleSubmit} className="space-y-6">
//                     <div>
//                         <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
//                             Phone number
//                         </label>
//                         <input
//                             type="tel"
//                             id="phone"
//                             value={phone}
//                             onChange={handlePhoneChange}
//                             className="block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
//                             placeholder="1234567890"
//                             required
//                         />
//                     </div>
//                     <div>
//                         <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
//                             Password
//                         </label>
//                         <input
//                             type="password"
//                             id="password"
//                             value={password}
//                             onChange={(e) => setPassword(e.target.value)}
//                             className="block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
//                             required
//                             placeholder="Password"
//                         />
//                     
//                     </div>
//                     {error && (
//                         <div className="text-red-500 text-sm mt-2">
//                             {error}
//                         </div>
//                     )}
//                     <button
//                         type="submit"
//                         className="w-full py-3 px-4 bg-blue-600 text-white rounded-lg shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
//                     >
//                         Sign In
//                     </button>
//                 </form>
//             </div>
//         </div>
//     );
// }

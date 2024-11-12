import db from "@repo/db/client";
import CredentialsProvider from "next-auth/providers/credentials"
import bcrypt from "bcrypt";

export const authOptions = {
    providers: [
      CredentialsProvider({
          name: 'Credentials',
          credentials: {
            phone: { label: "Phone number", type: "text", placeholder: "9863853389", required: true },
            password: { label: "Password", type: "password", required: true }
          },
          
          async authorize(credentials: any) {
            
            const hashedPassword = await bcrypt.hash(credentials.password, 10);
            const existingUser = await db.user.findFirst({
                where: {
                    number: credentials.phone
                }
            });

            if (existingUser) {
                const passwordValidation = await bcrypt.compare(credentials.password, existingUser.password);
                if (passwordValidation) {
                    return {
                        id: existingUser.id.toString(),
                        name: existingUser.name,
                        email: existingUser.number
                    }
                }
                return null;
            }

            try {
                const user = await db.$transaction(async (prisma) => {
                  const newUser = await prisma.user.create({
                    data: {
                      number: credentials.phone,
                      password: hashedPassword
                    }
                  });
            
                  // Create an initial balance for the new user
                  await prisma.balance.create({
                    data: {  
                      userId: newUser.id,
                      amount: 0,
                      locked: 0  // Assuming 0 means not locked
                    }
                  });
            
                  return newUser;
                });
            
                return {
                  id: user.id.toString(),
                  name: user.name,
                  email: user.number
                }
              } catch(e) {
                console.error("Error creating new user:", e);
                throw e;
              }
            
              return null
            },
        })
    ],
    secret: process.env.JWT_SECRET || "secret",
    callbacks: {
        // TODO: can u fix the type here? Using any is bad
        async session({ token, session }: any) {
            session.user.id = token.sub

            return session
        }
    }
  }
  
"use server";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth";
import prisma from "@repo/db/client";

export async function createOnRampTransaction(amount: number, provider: string) {
    const session = await getServerSession(authOptions);
    const token = Math.random().toString();
    const userId = session?.user?.id;

    if (!userId) {
        return {
            message: "You are not logged in"
        };
    }

    // Create the onRamp transaction with status "Processing"
    const transaction = await prisma.onRampTransaction.create({
        data: {

            userId: Number(userId),
            amount: amount,
            status: "Processing",
            startTime: new Date(),
            provider,
            token: token
        }
    });

    // Simulate verifying the token with the provider
    const tokenIsValid = await verifyTokenWithProvider(provider, token);

    if (tokenIsValid) {
        // Update the transaction status to 'Success' and add money to user's balance
        await prisma.onRampTransaction.update({
            where: { id: transaction.id },
            data: {
                status: "Success",
                startTime: transaction.startTime, // Keep the original startTime
            }
        });

        let balance = await prisma.balance.findUnique({
            where: { userId: Number(userId) },
          });
          
          if (!balance) {
            balance = await prisma.balance.create({
              data: {
                userId: Number(userId),
                amount: 0,
                locked: 0
              },
            });
          }

        // Update user's balance
        await prisma.balance.update({
            where: { userId: Number(userId) },
            data: {
                amount: {
                    increment: amount
                }
            }
        });

        return {
            message: "Money added to balance"
        };
    } else {
        // Handle the invalid token scenario by updating the transaction status to 'Failure'
        await prisma.onRampTransaction.update({
            where: { id: transaction.id },
            data: {
                status: "Failure",
            }
        });

        return {
            message: "Transaction failed, invalid token"
        };
    }
}

// Simulated function to verify the token with the provider
async function verifyTokenWithProvider(provider: string, token: string): Promise<boolean> {
    // Simulate the verification process, typically this would involve an API call to the provider
    return true; // Assume the token is valid for the purpose of this example
}

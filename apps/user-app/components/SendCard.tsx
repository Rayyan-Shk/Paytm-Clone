"use client";
import { Button } from "@repo/ui/button";
import { Card } from "@repo/ui/card";
import { Center } from "@repo/ui/center";
import { TextInput } from "@repo/ui/textinput";
import { useState } from "react";
import { p2pTransfer } from "../app/lib/actions/p2pTransfer";
import { z, ZodError } from "zod";

// Define Zod schema for validation
const sendCardSchema = z.object({
    number: z.string().nonempty("Number is required"),
    amount: z.string()
        .nonempty("Amount is required")
        .transform(value => parseFloat(value))
        .refine(value => !isNaN(value) && value > 0, {
            message: "Amount must be a positive number"
        }),
});

export function SendCard() {
    const [number, setNumber] = useState<string>("");
    const [amount, setAmount] = useState<string>("");
    const [alertMessage, setAlertMessage] = useState<string>("");
    const [alertType, setAlertType] = useState<string>(""); // "success" or "error"

    const handleSend = async () => {
        try {
            // Validate form data
            sendCardSchema.parse({ number, amount });

            // Convert amount to number and perform the transfer
            const result = await p2pTransfer(number, Number(amount) * 100);
    
            if (result.success) {
                setAlertMessage(result.message);
                setAlertType("success");
            } else {
                setAlertMessage(result.message);
                setAlertType("error");
            }
        } catch (error) {
            if (error instanceof ZodError) {
                setAlertMessage(error.errors.map(e => e.message).join(", "));
                setAlertType("error");
            } else {
                console.error("Handle send error:", error);
                setAlertMessage("An unexpected error occurred.");
                setAlertType("error");
            }
        }
    };

    return (
        <div className="h-[65vh] flex items-center justify-center">
            <Card title="Send" className="w-full max-w-md sm:max-w-lg lg:max-w-xl">
                <div className="min-w-72 pt-2">
                    <TextInput 
                        placeholder={"Number"} 
                        label="Number" 
                        onChange={(value) => setNumber(value)} 
                    />
                    <TextInput 
                        placeholder={"Amount"} 
                        label="Amount" 
                        onChange={(value) => setAmount(value)} 
                    />
                    <div className="pt-4 flex justify-center">
                        <Button className={""} onClick={handleSend}>
                            Send
                        </Button>
                    </div>
                    {alertMessage && (
                        <div 
                            className={`mt-4 p-2 rounded text-center ${alertType === "success" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}
                        >
                            {alertMessage}
                        </div>
                    )}
                </div>
            </Card>
        </div>
    );
}

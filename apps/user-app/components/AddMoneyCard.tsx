"use client";
import { Button } from "@repo/ui/button";
import { Card } from "@repo/ui/card";
import { Select } from "@repo/ui/select";
import { useEffect, useState } from "react";
import { TextInput } from "@repo/ui/textinput";
import { createOnRampTransaction } from "../app/lib/actions/createOnRamptxn";
import { z, ZodError } from "zod";

// Define Zod schema for validation
const addMoneySchema = z.object({
    amount: z.number()
        .positive("Amount must be a positive number")
        .min(1, "Amount must be at least 1"),
    provider: z.string().nonempty("Bank selection is required")
});

const SUPPORTED_BANKS = [
    {
        name: "HDFC Bank",
        redirectUrl: "https://netbanking.hdfcbank.com"
    },
    {
        name: "Axis Bank",
        redirectUrl: "https://www.axisbank.com/"
    }
];

export const AddMoney = () => {
    const [redirectUrl, setRedirectUrl] = useState(SUPPORTED_BANKS[0]?.redirectUrl);
    const [amount, setAmount] = useState<number>(0);
    const [provider, setProvider] = useState<string>(SUPPORTED_BANKS[0]?.name || "");
    const [successMessage, setSuccessMessage] = useState<string>("");
    const [errorMessage, setErrorMessage] = useState<string>("");

    // Check for the success flag in local storage
    useEffect(() => {
        const successFlag = localStorage.getItem("transactionSuccess");
        if (successFlag === "true") {
            setSuccessMessage("The transaction was completed successfully. Your account balance has been updated.");
            localStorage.removeItem("transactionSuccess"); // Clear the flag after showing the message
        }
    }, []);

    const handleAddMoney = async () => {
        try {
            // Validate form data
            addMoneySchema.parse({ amount, provider });

            const response = await createOnRampTransaction(amount * 100, provider);

            if (response.message === "Money added to balance") {
                // Set a success flag before redirecting
                localStorage.setItem("transactionSuccess", "true");
                window.location.href = redirectUrl || "";
            } else {
                // Handle transaction failure
                setErrorMessage("Transaction failed. Please try again.");
                setSuccessMessage(""); // Clear success message on failure
            }
        } catch (error) {
            if (error instanceof ZodError) {
                setErrorMessage(error.errors.map(e => e.message).join(", "));
                setSuccessMessage(""); // Clear success message on validation error
            } else {
                console.error("Error during transaction:", error);
                setErrorMessage("An error occurred. Please try again later.");
                setSuccessMessage(""); // Clear success message on error
            }
        }
    };

    return (
        <Card title="Add Money">
            <div className="w-full">
                <TextInput
                    label={"Amount"}
                    placeholder={"Enter amount"}
                    onChange={(value) => setAmount(Number(value))}
                />
                <div className="py-4 text-left">Select Bank</div>
                <Select
                    onSelect={(value) => {
                        const selectedBank = SUPPORTED_BANKS.find(x => x.name === value);
                        setRedirectUrl(selectedBank?.redirectUrl || "");
                        setProvider(selectedBank?.name || "");
                    }}
                    options={SUPPORTED_BANKS.map(x => ({
                        key: x.name,
                        value: x.name
                    }))}
                />
                <div className="flex justify-center pt-4">
                    <Button className={""} onClick={handleAddMoney}>
                        Add Money
                    </Button>
                </div>
                {successMessage && (
                    <div className="pt-4 text-center text-green-600 font-semibold bg-green-100 p-2 rounded-md shadow-sm">
                        {successMessage}
                    </div>
                )}
                {errorMessage && (
                    <div className="pt-4 text-center text-red-600 font-semibold bg-red-100 p-2 rounded-md shadow-sm">
                        {errorMessage}
                    </div>
                )}
            </div>
        </Card>
    );
}

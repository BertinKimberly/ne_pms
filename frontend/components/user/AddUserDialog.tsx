import React, { useState } from "react";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useRegisterUser } from "@/hooks/useAuth";

export function AddUserDialog() {
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [email, setEmail] = useState("");
    const [role, setRole] = useState(""); // Role is optional
    const [password, setPassword] = useState("");
    const registerMutation = useRegisterUser();

    const handleAddUser = async () => {
        // Validation for required fields
        if (!firstName || !lastName || !email || !password) {
            toast.error("First Name, Last Name, Email, and Password are required");
            return;
        }

        try {
            await registerMutation.mutateAsync({
                firstName,
                lastName,
                email,
                password,
                role: role || undefined, // Send role as undefined if empty
            });
            // Reset fields after successful registration
            setFirstName("");
            setLastName("");
            setEmail("");
            setPassword("");
            setRole("");
        } catch (error) {
            toast.error("Adding user failed");
        }
    };

    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button className="bg-main !rounded !text-sm !font-normal">
                    Add User
                </Button>
            </DialogTrigger>
            <DialogContent className="bg-white">
                <DialogHeader>
                    <DialogTitle>Add New User</DialogTitle>
                    <DialogDescription>
                        Enter the user details and assign a role (optional).
                    </DialogDescription>
                </DialogHeader>
                <div className="flex flex-col gap-4">
                    <input
                        type="text"
                        className="border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-main"
                        placeholder="First Name"
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                    />

                    <input
                        type="text"
                        className="border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-main"
                        placeholder="Last Name"
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                    />

                    <input
                        type="email"
                        className="border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-main"
                        placeholder="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />

                    <input
                        type="password"
                        className="border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-main"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />

                    {/* Role selection */}
                    <select
                        className="border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-main"
                        value={role}
                        onChange={(e) => setRole(e.target.value)}
                    >
                        <option value="" disabled>Select Role (Optional)</option>
                        <option value="USER">USER</option>
                        <option value="ADMIN">ADMIN</option>
                    </select>

                    <Button
                        className="bg-main !rounded"
                        onClick={handleAddUser}
                        disabled={registerMutation.isPending}
                    >
                        {registerMutation.isPending ? "Saving..." : "Save"}
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
}
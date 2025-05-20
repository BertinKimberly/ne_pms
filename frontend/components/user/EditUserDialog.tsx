import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { User } from "@/types";
import { PenBox } from "lucide-react";
import { useUpdateUserRole } from "@/hooks/useUsers";


type EditUserDialogProps = {
    user: User;
};

export default function EditUserDialog({ user }: EditUserDialogProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [role, setRole] = useState(user.role || "");

    const updateUserRoleMutation = useUpdateUserRole();

    const handleUpdate = async () => {
        if (!role) {
            toast.error("Please select a role");
            return;
        }
        try {
            const response = await updateUserRoleMutation.mutateAsync({
                userId: user.id,
                role: role as "ADMIN" | "USER",
            });
            if (response.success) {
                toast.success(response.message);
                setIsOpen(false);
            } else {
                toast.error(response.message);
            }
        } catch (error) {
            toast.error("Updating user role failed!");
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
                <Button variant="secondary" className="!rounded hover:bg-white" size="sm">
                    <PenBox size={18} />
                </Button>
            </DialogTrigger>
            <DialogContent className="bg-white">
                <DialogHeader>
                    <DialogTitle>Edit User Role</DialogTitle>
                    <DialogDescription>Change the user's role below:</DialogDescription>
                </DialogHeader>
                <div className="flex flex-col gap-4">
                    <select
                        className="border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-main"
                        value={role}
                        onChange={(e) => setRole(e.target.value)}
                    >
                        <option value="" disabled>Select Role</option>
                        <option value="USER">USER</option>
                        <option value="ADMIN">ADMIN</option>
                    </select>
                    <div className="flex gap-2 justify-end mt-4">
                        <Button variant="secondary" onClick={() => setIsOpen(false)}>Cancel</Button>
                        <Button className="bg-main !rounded" onClick={handleUpdate} disabled={updateUserRoleMutation.isPending}>
                            {updateUserRoleMutation.isPending ? "Saving..." : "Save"}
                        </Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}
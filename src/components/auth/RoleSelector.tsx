"use client";

import { useAuth } from '@/contexts/AuthContext';
import { USER_ROLES } from '@/lib/constants';
import type { UserRole } from '@/lib/types';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";

export function RoleSelector() {
  const { userRole, setUserRole } = useAuth();

  return (
    <div className="flex items-center gap-2">
      <Label htmlFor="role-select" className="text-sm">Role:</Label>
      <Select value={userRole} onValueChange={(value) => setUserRole(value as UserRole)}>
        <SelectTrigger id="role-select" className="w-[180px] h-9">
          <SelectValue placeholder="Select role" />
        </SelectTrigger>
        <SelectContent>
          {USER_ROLES.map((role) => (
            <SelectItem key={role} value={role}>
              {role}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}

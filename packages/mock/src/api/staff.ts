import type { StaffMember, StaffRole, StaffStatus } from '@cpatracker/types';
import { delay } from '../delay';
import { staff } from '../data/staff';
import { USE_MOCK } from '../config';

export interface StaffFilters {
  role?: StaffRole;
  status?: StaffStatus;
  search?: string;
}

export async function getStaff(filters?: StaffFilters): Promise<StaffMember[]> {
  await delay();
  if (!USE_MOCK) throw new Error('Real API not wired yet');

  return staff.filter((member) => {
    if (filters?.role && member.role !== filters.role) return false;
    if (filters?.status && member.status !== filters.status) return false;
    if (filters?.search) {
      const q = filters.search.toLowerCase();
      if (!member.name.toLowerCase().includes(q) && !member.email.toLowerCase().includes(q)) {
        return false;
      }
    }
    return true;
  });
}

export interface CreateStaffInput {
  name: string;
  email: string;
  role: StaffRole;
}

export async function createStaff(input: CreateStaffInput): Promise<StaffMember> {
  await delay();
  if (!USE_MOCK) throw new Error('Real API not wired yet');

  const member: StaffMember = {
    id: `staff-${staff.length + 1}-${Date.now()}`,
    name: input.name,
    email: input.email,
    role: input.role,
    status: 'ACTIVE',
    createdAt: new Date().toISOString(),
    lastLoginAt: null,
  };
  staff.push(member);
  return member;
}

export async function updateStaffRole(id: string, role: StaffRole): Promise<StaffMember> {
  await delay();
  if (!USE_MOCK) throw new Error('Real API not wired yet');

  const member = staff.find((m) => m.id === id);
  if (!member) throw new Error(`Staff member ${id} not found`);
  member.role = role;
  return member;
}

export async function updateStaffStatus(id: string, status: StaffStatus): Promise<StaffMember> {
  await delay();
  if (!USE_MOCK) throw new Error('Real API not wired yet');

  const member = staff.find((m) => m.id === id);
  if (!member) throw new Error(`Staff member ${id} not found`);
  member.status = status;
  return member;
}

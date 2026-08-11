export type UserStatus = 'pending' | 'active' | 'suspended' | 'disabled';
export type MemberType = 'internal' | 'external';

export interface User {
  id: string;
  username: string;
  displayName: string;
  email?: string;
  status: UserStatus;
  avatarInitials?: string;
  createdAt: string;
}

export interface UserListItem extends User {
  memberType: MemberType;
  expiresAt?: string;
  organizations: string[];
  departments?: string[];
  projects?: string[];
}

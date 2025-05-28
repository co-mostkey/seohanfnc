export interface Member {
    id: string;
    email: string;
    name: string;
    phone?: string;
    company?: string;
    position?: string;
    address?: string;
    interests?: string[];
    status: 'active' | 'inactive' | 'pending' | 'suspended';
    emailVerified: boolean;
    createdAt: string;
    lastLoginAt?: string;
    profileImage?: string;
    notes?: string;
    source: 'website' | 'inquiry' | 'manual' | 'import';
    marketingConsent: boolean;
    privacyConsent: boolean;
}

export interface MemberData {
    members: Member[];
    metadata: {
        lastUpdated: string;
        totalMembers: number;
        activeMembers: number;
        pendingMembers: number;
    };
}

export interface MemberStats {
    total: number;
    active: number;
    inactive: number;
    pending: number;
    suspended: number;
    newThisMonth: number;
    newThisWeek: number;
    recentLogins: number;
}

export interface MemberFilters {
    status?: string;
    source?: string;
    emailVerified?: boolean;
    marketingConsent?: boolean;
    search?: string;
    dateFrom?: string;
    dateTo?: string;
} 
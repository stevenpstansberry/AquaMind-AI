export interface user {
    id: string;
    username: string; // Unique username
    email: string;
    fullName: string;
    passwordHash: string; // Hashed password
    subscribe?: boolean;
    aquariumIds?: string[]; // List of owned aquariums
    role?: 'admin' | 'user'; // User role
    createdAt: Date; // Account creation timestamp
    updatedAt: Date; // Last update timestamp
    profilePictureUrl?: string; // Optional profile picture URL
    bio?: string; // Optional user biography
}
export interface User {
    id?: string;
    username?: string; // Unique username
    email: string;
    firstName?: string;
    aquariumIds?: string[]; // List of owned aquariums
    role?: 'admin' | 'user'; // User role
    createdAt?: Date; // Account creation timestamp
    profilePictureUrl?: string; // Optional profile picture URL
    bio?: string; // Optional user biography
}
export type Major = {
    majorId: string;
    majorName: string;
    schoolId: string;
};

export interface User {
    id: number
    name: string | null
    email: string | null
    image: string | null
    expected_graduation_year: number | null
    expected_graduation_month: string | null
    is_admin: boolean
    created_at: Date
    updated_at: Date
}
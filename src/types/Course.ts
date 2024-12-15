export interface Major {
    majorId: string;
    majorName: string;
    schoolId: string;
}

export interface User {
    id: number;
    email: string;
    name: string;
    expectedGraduationMonth: string,
    expectedGraduationYear: number,
    majors: Major[];
}

export interface ProfessorModel {
    id: string;
    firstName: string;
    lastName: string;
}

export interface SectionModel {
    sectionId: number;
    sectionNum: number;
    pUni: string;
    capacity: number;
    day: string;
    startTime: string; // We'll use string for time, as it's easier to work with in JS
    endTime: string;
    semester: string;
    year: number;
    courseId: string;
}

export interface EnrichedSectionModel {
    sectionModel: SectionModel;
    professorModel: ProfessorModel;
}

export interface CourseModel {
    courseId: string;
    courseName: string;
    credits: number;
    schoolId: string;
}

export interface EnrichedCourseModel {
    courseModel: CourseModel;
    sections: EnrichedSectionModel[];
}

export interface PagedModelEnrichedCourseModel {
    _embedded: {
        enrichedCourseModelList: EnrichedCourseModel[];
    };
    page: {
        size: number;
        totalElements: number;
        totalPages: number;
        number: number;
    };
}

export interface Schedule {
    schedule_id: number;
    label: string;
    user_id: number;
    created_at: Date;
    updated_at: Date;
}

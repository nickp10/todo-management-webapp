export interface DBSchema {
    users: User[];
    tasks: Task[];
    customFields: Field[];
}

export interface User {
    id: string;
    username: string;
    password: string;
    isAdmin: boolean;
    isRoot: boolean;
    maxTasks: number;
    adminCurrentTasksTab?: string;
    adminTasksPerPage?: number;
}

export interface Task {
    id: string;
    title: string;
    description: string;
    dateCreated: Date;
    dateStarted?: Date;
    dateSentForReview?: Date;
    dateCompleted?: Date;
    deadline?: Date;
    notes?: string;
    assignee?: string;
    completedBy?: string;
    status: string;
}

export interface Field {
    id: string;
    name: string;
}

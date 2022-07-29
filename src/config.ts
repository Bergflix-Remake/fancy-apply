export interface Task {
    description: string;
    title: string;
    tweets: {
        content: string;
        handle: string;
        replies: string;
        username: string;
    }[]
}

import 'server-only';
import { readItems, writeItems, deleteItem, updateItem } from '@/lib/file-db';
import { ASPost } from '@/types/as-post';

const FILE_NAME = 'as-board.json';

export async function listPosts(): Promise<ASPost[]> {
    return (await readItems<ASPost>(FILE_NAME)) || [];
}

export async function getPost(id: string): Promise<ASPost | null> {
    const posts = await listPosts();
    return posts.find((p) => p.id === id) || null;
}

export async function addPost(post: ASPost): Promise<ASPost> {
    const posts = await listPosts();
    posts.unshift(post);
    await writeItems(FILE_NAME, posts);
    return post;
}

export async function updatePost(id: string, data: Partial<ASPost>): Promise<ASPost | null> {
    const updated = await updateItem<ASPost>(FILE_NAME, id, data);
    return updated;
}

export async function deletePost(id: string): Promise<boolean> {
    return await deleteItem<ASPost>(FILE_NAME, id);
} 
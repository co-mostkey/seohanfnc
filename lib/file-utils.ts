import fs from 'fs/promises';
import path from 'path';
import { Product } from '@/types/product';

const PRODUCTS_DIR = path.join(process.cwd(), 'content', 'data', 'products');
const PRODUCTS_JSON_PATH = path.join(PRODUCTS_DIR, 'products.json');
const BACKUP_DIR = path.join(PRODUCTS_DIR, 'backups');
const LOCK_FILE_PATH = path.join(PRODUCTS_DIR, '.products.json.lock');
const LOCK_TIMEOUT = 5000; // 5초 타임아웃
const LOCK_RETRY_INTERVAL = 100; // 0.1초 간격으로 재시도
const MAX_BACKUPS = 20; // 최대 백업 개수 (기존 50에서 20으로 수정)

export interface ProductsDataStructure {
    categories: Array<{
        id: string;
        nameKo?: string;
        nameEn?: string;
        nameCn?: string;
        products: Product[];
    }>;
}

// 모든 제품 ID를 가져오는 함수 추가
export async function getAllProductIds(filePath: string = PRODUCTS_JSON_PATH): Promise<string[]> {
    try {
        const productsData = await readProductsData(); // 기존 readProductsData 활용
        const ids: string[] = [];
        if (productsData && Array.isArray(productsData.categories)) {
            productsData.categories.forEach((category) => {
                if (category && Array.isArray(category.products)) {
                    category.products.forEach((product) => {
                        if (product && product.id) {
                            ids.push(product.id);
                        }
                    });
                }
            });
        }
        return ids;
    } catch (error) {
        console.error("Error reading all product IDs:", error);
        return []; // 오류 발생 시 빈 배열 반환 또는 에러 throw (호출 측에서 처리)
    }
}

async function acquireLock(): Promise<void> {
    const startTime = Date.now();
    while (true) {
        try {
            await fs.writeFile(LOCK_FILE_PATH, 'lock', { flag: 'wx' }); // wx: 파일이 존재하면 실패
            return;
        } catch (error: any) {
            if (error.code === 'EEXIST') {
                if (Date.now() - startTime > LOCK_TIMEOUT) {
                    // 오래된 lock 파일일 수 있으므로, 생성 시간 확인 후 삭제 고려 가능 (여기선 단순 타임아웃)
                    throw new Error('Failed to acquire lock: Timeout. products.json is currently locked.');
                }
                await new Promise(resolve => setTimeout(resolve, LOCK_RETRY_INTERVAL));
            } else {
                throw error;
            }
        }
    }
}

async function releaseLock(): Promise<void> {
    try {
        await fs.unlink(LOCK_FILE_PATH);
    } catch (error: any) {
        // 파일이 이미 없거나 다른 이유로 실패해도 무시 (최대한 lock 해제 시도)
        if (error.code !== 'ENOENT') {
            console.warn('Failed to release lock file:', error.message);
        }
    }
}

export async function readProductsData(): Promise<ProductsDataStructure> {
    try {
        const fileContent = await fs.readFile(PRODUCTS_JSON_PATH, 'utf-8');
        return JSON.parse(fileContent) as ProductsDataStructure;
    } catch (error: any) {
        // 파일이 없거나 경로가 없을 때 초기 구조를 생성하여 반환
        if (error.code === 'ENOENT') {
            // 디렉터리(및 상위 경로)가 존재하지 않을 수 있으므로 생성 시도
            await fs.mkdir(PRODUCTS_DIR, { recursive: true });
            const initialData: ProductsDataStructure = { categories: [] };
            await fs.writeFile(PRODUCTS_JSON_PATH, JSON.stringify(initialData, null, 2), 'utf-8');
            return initialData;
        }
        throw error;
    }
}

export async function writeProductsData(data: ProductsDataStructure): Promise<void> {
    await acquireLock();
    try {
        const dataToSave: ProductsDataStructure = {
            ...data,
            categories: data.categories.map(category => ({
                ...category,
                products: category.products.map(product => {
                    const { productCategoryId, ...rest } = product;
                    return rest;
                })
            }))
        };

        // 디렉토리 존재 확인 및 생성
        await fs.mkdir(PRODUCTS_DIR, { recursive: true });

        // 기존 파일 백업 (있을 때만)
        try {
            const currentContent = await fs.readFile(PRODUCTS_JSON_PATH, 'utf-8');
            await fs.mkdir(BACKUP_DIR, { recursive: true });
            const backupFileName = `products_${Date.now()}.json`;
            await fs.writeFile(path.join(BACKUP_DIR, backupFileName), currentContent, 'utf-8');

            // 백업 개수 제한 (최대 MAX_BACKUPS 개 유지)
            const backupFiles = (await fs.readdir(BACKUP_DIR)).filter(f => f.startsWith('products_') && f.endsWith('.json'));
            if (backupFiles.length > MAX_BACKUPS) {
                const sorted = backupFiles.sort((a, b) => {
                    // 파일명에서 타임스탬프 부분만 추출하여 숫자로 비교
                    const timeA = parseInt(a.substring(a.indexOf('_') + 1, a.lastIndexOf('.json'))) || 0;
                    const timeB = parseInt(b.substring(b.indexOf('_') + 1, b.lastIndexOf('.json'))) || 0;
                    return timeA - timeB; // 오름차순 정렬 (오래된 파일이 앞쪽)
                });
                for (let i = 0; i < sorted.length - MAX_BACKUPS; i++) {
                    await fs.unlink(path.join(BACKUP_DIR, sorted[i]));
                }
            }
        } catch (err: any) {
            if (err.code !== 'ENOENT') {
                console.warn('[ProductsData] Backup failed:', err.message);
            }
        }

        await fs.writeFile(PRODUCTS_JSON_PATH, JSON.stringify(dataToSave, null, 2), 'utf-8');
    } finally {
        await releaseLock();
    }
} 
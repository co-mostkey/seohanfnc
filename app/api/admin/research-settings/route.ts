import { NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';

const dataFilePath = path.join(process.cwd(), 'data', 'company.json');

// Helper function to read data
async function readData() {
    try {
        const jsonData = await fs.readFile(dataFilePath, 'utf8');
        return JSON.parse(jsonData);
    } catch (error) {
        // If file doesn't exist or other read error, return a default structure for researchPage
        console.error("Error reading company.json for API:", error);
        return { researchPage: {} }; // Ensure researchPage key exists
    }
}

// Helper function to write data
async function writeData(data: any) {
    await fs.writeFile(dataFilePath, JSON.stringify(data, null, 4), 'utf8');
}

export async function GET() {
    try {
        const allData = await readData();
        // Ensure researchPage exists, if not, initialize it with default structure
        const researchPageData = allData.researchPage || {
            hero: { title: '', subtitle: '', backgroundImageUrl: '', backgroundColor: '', backgroundOpacity: 1, backgroundOverlayColor: '' },
            introduction: { title: '', description: '', imageUrl: '' },
            areas: { title: '', items: [] },
            achievements: { title: '', items: [] },
            awardsSectionTitle: '',
            infrastructure: { title: '', description: '', imageUrl: '' },
        };
        return NextResponse.json(researchPageData);
    } catch (error) {
        console.error('GET /api/admin/research-settings Error:', error);
        return NextResponse.json({ message: 'Error fetching research settings', error: (error instanceof Error ? error.message : String(error)) }, { status: 500 });
    }
}

export async function POST(request: Request) { // Added type for request
    try {
        const updatedResearchPageData = await request.json();
        if (!updatedResearchPageData) {
            return NextResponse.json({ message: 'Bad Request: No data provided.' }, { status: 400 });
        }

        const allData = await readData();

        // Update only the researchPage part of the data
        const newData = {
            ...allData, // Preserve other data in company.json
            researchPage: updatedResearchPageData
        };

        await writeData(newData);
        return NextResponse.json({ message: 'Research settings updated successfully' });
    } catch (error) {
        console.error('POST /api/admin/research-settings Error:', error);
        return NextResponse.json({ message: 'Error updating research settings', error: (error instanceof Error ? error.message : String(error)) }, { status: 500 });
    }
} 
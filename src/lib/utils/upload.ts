import { writeFile } from 'fs/promises';
import path from 'path';

export async function saveFile(file: File, directory: string): Promise<string> {
  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);

  // Create a unique filename
  const timestamp = Date.now();
  const originalName = file.name.toLowerCase().replace(/[^a-z0-9.]/g, '-');
  const filename = `${timestamp}-${originalName}`;
  
  // Ensure the upload directory exists
  const uploadDir = path.join(process.cwd(), 'public', directory);
  await ensureDir(uploadDir);
  
  // Save the file
  const filepath = path.join(uploadDir, filename);
  await writeFile(filepath, buffer);
  
  // Return the public URL
  return `/${directory}/${filename}`;
}

async function ensureDir(dirpath: string) {
  try {
    await fs.promises.mkdir(dirpath, { recursive: true });
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code !== 'EEXIST') {
      throw error;
    }
  }
}

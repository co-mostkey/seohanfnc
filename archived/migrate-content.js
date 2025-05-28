const fs = require('fs-extra');
const path = require('path');
const glob = require('glob');

const SRC_ROOT = 'C:/Users/comos/seohan-website';
const DST_ROOT = 'C:/Users/comos/main_seohan-website';

// Create content directory if it doesn't exist
fs.ensureDirSync(path.join(DST_ROOT, 'content'));
fs.ensureDirSync(path.join(DST_ROOT, 'content/data'));

console.log('\n== Starting Content Migration from Original Website ==');
console.log(`Source: ${SRC_ROOT}`);
console.log(`Destination: ${DST_ROOT}`);

// 1. Migrate product data JSON files
console.log('\n== Migrating Product Data ==');
try {
  const productsJsonSrc = path.join(SRC_ROOT, 'data', 'products', 'products.json');
  if (fs.existsSync(productsJsonSrc)) {
    // Create destination directories
    fs.ensureDirSync(path.join(DST_ROOT, 'content/data/products'));
    fs.ensureDirSync(path.join(DST_ROOT, 'data/products'));
    
    // Copy to both content and data directories
    fs.copySync(productsJsonSrc, path.join(DST_ROOT, 'content/data/products/products.json'));
    fs.copySync(productsJsonSrc, path.join(DST_ROOT, 'data/products/products.json'));
    console.log('✓ Copied products.json to content/data/products and data/products');
    
    // Try to read and process the products data for dynamic page generation
    try {
      const productsData = fs.readJsonSync(productsJsonSrc);
      console.log(`\n== Processing Product Categories (${productsData.categories?.length || 0}) ==`);
      
      // Extract all products from all categories
      const allProducts = [];
      if (productsData.categories) {
        productsData.categories.forEach(category => {
          if (category.products && Array.isArray(category.products)) {
            category.products.forEach(product => {
              allProducts.push({
                id: product.id,
                name: product.nameKo,
                nameEn: product.nameEn,
                nameCn: product.nameCn,
                category: category.id,
                categoryName: category.nameKo,
                description: product.descriptionKo,
                descriptionEn: product.descriptionEn,
                descriptionCn: product.descriptionCn,
                image: product.image
              });
            });
          }
        });
      }
      
      console.log(`Found ${allProducts.length} products across categories`);
      
      // Generate static product pages for all products
      allProducts.forEach(product => {
        // Create product page in the Next.js app directory
        const pagePath = path.join(DST_ROOT, 'app', 'products', product.id, 'page.tsx');
        fs.ensureDirSync(path.dirname(pagePath));
        
        const pageContent = `import React from 'react';
import ProductDetail from '@/components/product-detail';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: \`\${product.name} - 서한에프앤씨\`,
  description: \`\${product.description}\`,
}

export default function ProductPage() {
  return <ProductDetail id="${product.id}" />;
}
`;
        
        fs.writeFileSync(pagePath, pageContent);
        console.log(`✓ Generated product page: app/products/${product.id}/page.tsx`);
      });
    } catch (err) {
      console.error('Error processing products data:', err);
    }
  } else {
    console.log('⚠ Products JSON file not found at:', productsJsonSrc);
  }
} catch (err) {
  console.error('Error migrating product data:', err);
}

// 2. Migrate document data
console.log('\n== Migrating Document Data ==');
try {
  const documentsJsonSrc = path.join(SRC_ROOT, 'data', 'documents', 'documents.json');
  if (fs.existsSync(documentsJsonSrc)) {
    // Create destination directory
    fs.ensureDirSync(path.join(DST_ROOT, 'content/data/documents'));
    fs.copySync(documentsJsonSrc, path.join(DST_ROOT, 'content/data/documents/documents.json'));
    console.log('✓ Copied documents.json to content/data/documents');
  } else {
    console.log('⚠ Documents JSON file not found at:', documentsJsonSrc);
  }
} catch (err) {
  console.error('Error migrating document data:', err);
}

// 3. Migrate Document Files
console.log('\n== Migrating Document Files ==');
try {
  const docSrcDir = path.join(SRC_ROOT, 'public', 'documents');
  const docDestDir = path.join(DST_ROOT, 'public/assets/documents');
  
  if (fs.existsSync(docSrcDir)) {
    fs.ensureDirSync(docDestDir);
    
    // Copy all PDF documents
    glob.sync('**/*.{pdf,PDF}', { cwd: docSrcDir }).forEach(file => {
      const src = path.join(docSrcDir, file);
      const dst = path.join(docDestDir, file);
      fs.ensureDirSync(path.dirname(dst));
      fs.copySync(src, dst);
      console.log(`✓ Copied document: ${file}`);
    });
  } else {
    console.log('⚠ Documents directory not found at:', docSrcDir);
  }
} catch (err) {
  console.error('Error migrating document files:', err);
}

// 4. Migrate Product Images
console.log('\n== Migrating Product Images ==');
try {
  const imgSrcDir = path.join(SRC_ROOT, 'public', 'images', 'products');
  const imgDestDir = path.join(DST_ROOT, 'public/assets/images/products');
  
  if (fs.existsSync(imgSrcDir)) {
    fs.ensureDirSync(imgDestDir);
    
    // Copy all product images
    glob.sync('**/*.{jpg,jpeg,png,webp,svg}', { cwd: imgSrcDir }).forEach(file => {
      const src = path.join(imgSrcDir, file);
      const dst = path.join(imgDestDir, file);
      fs.ensureDirSync(path.dirname(dst));
      fs.copySync(src, dst);
      console.log(`✓ Copied product image: ${file}`);
    });
  } else {
    console.log('⚠ Product images directory not found at:', imgSrcDir);
  }
} catch (err) {
  console.error('Error migrating product images:', err);
}

// 5. Migrate other website content (about, research, etc.)
console.log('\n== Migrating Other Content ==');
[
  {src: 'data/news', dest: 'content/data/news'},
  {src: 'public/images/hero', dest: 'public/assets/images/hero'},
  {src: 'public/images/company', dest: 'public/assets/images/company'},
  {src: 'public/images/icons', dest: 'public/assets/images/icons'},
  {src: 'public/about', dest: 'public/assets/about'},
  {src: 'public/awards', dest: 'public/assets/awards'},
  {src: 'public/certification', dest: 'public/assets/certification'}
].forEach(dir => {
  try {
    const srcDir = path.join(SRC_ROOT, dir.src);
    const destDir = path.join(DST_ROOT, dir.dest);
    
    if (fs.existsSync(srcDir)) {
      fs.ensureDirSync(destDir);
      fs.copySync(srcDir, destDir);
      console.log(`✓ Copied ${dir.src} to ${dir.dest}`);
    } else {
      console.log(`⚠ Directory not found: ${dir.src}`);
    }
  } catch (err) {
    console.error(`Error copying ${dir.src}:`, err);
  }
});

console.log('\n== Content Migration Complete ==');
console.log('Please check the following:');
console.log('1. Product images at public/assets/images/products');
console.log('2. Product data at content/data/products');
console.log('3. Document files at public/assets/documents');
console.log('4. Generated product pages in app/products/[product-id]/page.tsx');
console.log('\nYou may need to adjust paths in your components if the directory structure has changed.'); 
// Placeholder for articles data
export interface Article {
  id: string;
  title: string;
  content: string;
  date: string;
  category: string;
  thumbnail?: string;
}

// Dummy articles data for static generation
export const articles: Article[] = [
  {
    id: "fire-safety-tips",
    title: "Fire Safety Tips for Industrial Settings",
    content: "Lorem ipsum dolor sit amet, consectetur adipiscing elit...",
    date: "2023-04-15",
    category: "Safety",
    thumbnail: "/images/articles/fire-safety.jpg"
  },
  {
    id: "new-regulations-2023",
    title: "New Fire Safety Regulations for 2023",
    content: "Lorem ipsum dolor sit amet, consectetur adipiscing elit...",
    date: "2023-02-22",
    category: "Regulations",
    thumbnail: "/images/articles/regulations.jpg"
  },
  {
    id: "equipment-maintenance",
    title: "Proper Maintenance of Fire Safety Equipment",
    content: "Lorem ipsum dolor sit amet, consectetur adipiscing elit...",
    date: "2023-01-10",
    category: "Maintenance",
    thumbnail: "/images/articles/maintenance.jpg"
  }
];

// Function to get all articles
export function getAllArticles(): Article[] {
  return articles;
}

// Function to find article by ID
export function findArticleById(id: string): Article | undefined {
  return articles.find(article => article.id === id);
}

// Function to get articles by category
export function getArticlesByCategory(category: string): Article[] {
  return articles.filter(article => article.category === category);
} 
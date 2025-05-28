import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ChevronLeft } from 'lucide-react';
import { SimpleBreadcrumb } from '@/components/ui/breadcrumb';
import { notFound } from 'next/navigation';
import { getArticleById } from '@/data/articles';
import ArticleDetailClient from './client';
import { Metadata } from 'next';

// Mock article data
const articles = [
  {
    id: '1',
    title: 'New Product Launch: Introducing the XR-5000 Series',
    date: '2023-05-15',
    author: 'Seohan Marketing Team',
    category: 'Product News',
    content: `
      <p>We are excited to announce the launch of our new XR-5000 Series, a revolutionary product line designed to meet the evolving needs of our customers in the manufacturing industry.</p>
      
      <p>The XR-5000 Series represents the culmination of years of research and development, incorporating the latest technological advancements to deliver exceptional performance, reliability, and efficiency.</p>
      
      <h2>Key Features</h2>
      <ul>
        <li>Advanced precision engineering for superior accuracy</li>
        <li>Energy-efficient design for reduced operating costs</li>
        <li>Integrated smart monitoring for predictive maintenance</li>
        <li>Compact footprint for flexible installation</li>
        <li>User-friendly interface for simplified operation</li>
      </ul>
      
      <p>Initial customer feedback has been overwhelmingly positive, with users reporting significant improvements in productivity and reduced downtime compared to previous models.</p>
      
      <p>The XR-5000 Series is now available for order, with shipments beginning next month. Contact our sales team for more information or to schedule a demonstration.</p>
    `,
    imageUrl: '/images/placeholder.jpg',
  },
  {
    id: '2',
    title: 'Seohan Receives Industry Excellence Award',
    date: '2023-04-10',
    author: 'Seohan PR Team',
    category: 'Company News',
    content: `
      <p>We are proud to announce that Seohan has been recognized with the Industry Excellence Award for Innovation at the annual Manufacturing Technology Conference held last week in Seoul.</p>
      
      <p>This prestigious award acknowledges our ongoing commitment to advancing manufacturing technologies and developing solutions that address the complex challenges faced by modern industries.</p>
      
      <p>The award specifically highlighted our recent innovations in automated quality control systems, which have set new standards for precision and reliability in the industry.</p>
      
      <h2>Statement from Our CEO</h2>
      <blockquote>
        "This award is a testament to the dedication and creativity of our entire team. We remain committed to pushing the boundaries of what's possible in manufacturing technology, always with the goal of delivering exceptional value to our customers."
      </blockquote>
      
      <p>The recognition comes at an exciting time for Seohan, as we continue to expand our global presence and invest in cutting-edge research and development initiatives.</p>
      
      <p>We extend our sincere gratitude to our customers, partners, and employees who have contributed to this achievement.</p>
    `,
    imageUrl: '/images/placeholder.jpg',
  },
  {
    id: '3',
    title: 'Sustainability Report: Our Path to Carbon Neutrality',
    date: '2023-03-22',
    author: 'Seohan Sustainability Office',
    category: 'Sustainability',
    content: `
      <p>Today, we are pleased to release our annual Sustainability Report, detailing our progress toward our environmental goals and outlining our roadmap to carbon neutrality by 2030.</p>
      
      <p>Over the past year, we have made significant strides in reducing our environmental footprint across all operations, including a 15% reduction in energy consumption and a 20% decrease in water usage at our manufacturing facilities.</p>
      
      <h2>Key Initiatives</h2>
      <ul>
        <li>Installation of solar panels at our main production facility, now generating 30% of the facility's electricity needs</li>
        <li>Implementation of closed-loop water recycling systems, dramatically reducing freshwater consumption</li>
        <li>Transition to electric vehicles for our company fleet</li>
        <li>Redesign of packaging to eliminate single-use plastics</li>
        <li>Partnership with local communities for reforestation projects</li>
      </ul>
      
      <p>These efforts have not only reduced our environmental impact but have also resulted in significant cost savings, demonstrating that sustainability and business success can go hand in hand.</p>
      
      <p>Looking ahead, we have outlined an ambitious plan to achieve carbon neutrality by 2030, including further investments in renewable energy, process optimization, and carbon offset programs.</p>
      
      <p>The full report is available for download on our website.</p>
    `,
    imageUrl: '/images/placeholder.jpg',
  },
];

interface ArticlePageProps {
  params: Promise<{
    id: string;
  }>;
}

async function getArticleData(id: string) {
  return articles.find((article) => article.id === id);
}

export default async function ArticleDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  const { id } = resolvedParams;
  const article = await getArticleData(id);

  if (!article) {
    return <div>Article not found</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Breadcrumb */}
      <SimpleBreadcrumb items={[
        { text: 'Home', href: '/' },
        { text: 'News', href: '/articles' },
        { text: article.title, href: `#`, active: true },
      ]} />
      {/* Back link */}
      <div className="mt-6 mb-8">
        <Link
          href="/articles"
          className="inline-flex items-center text-sm text-gray-600 hover:text-primary dark:text-gray-400 dark:hover:text-primary-400"
        >
          <ChevronLeft className="h-4 w-4 mr-1" />
          Back to News
        </Link>
      </div>
      <article className="mx-auto max-w-4xl">
        <header className="mb-8">
          <h1 className="mb-4 text-3xl font-bold tracking-tight text-gray-900 dark:text-white md:text-4xl">
            {article.title}
          </h1>

          <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-gray-600 dark:text-gray-400">
            <time dateTime={article.date}>
              {new Date(article.date).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </time>
            <div>•</div>
            <div>{article.category}</div>
            <div>•</div>
            <div>{article.author}</div>
          </div>
        </header>

        {article.imageUrl && (
          <div className="mb-8 overflow-hidden rounded-lg">
            <Image
              src={article.imageUrl}
              alt={article.title}
              width={900}
              height={500}
              className="w-full object-cover"
            />
          </div>
        )}

        <div
          className="prose max-w-none dark:prose-invert"
          dangerouslySetInnerHTML={{ __html: article.content }}
        />

        <div className="mt-12 flex flex-wrap gap-2">
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Tags:
          </span>
          <div className="flex flex-wrap gap-2">
            <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-800 dark:bg-gray-800 dark:text-gray-200">
              {article.category}
            </span>
            <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-800 dark:bg-gray-800 dark:text-gray-200">
              News
            </span>
            <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-800 dark:bg-gray-800 dark:text-gray-200">
              Seohan
            </span>
          </div>
        </div>

        <div className="mt-12 border-t border-gray-200 pt-8 dark:border-gray-800">
          <h2 className="mb-6 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
            Related Articles
          </h2>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            {articles
              .filter(a => a.id !== article.id)
              .slice(0, 2)
              .map(relatedArticle => (
                <Link
                  key={relatedArticle.id}
                  href={`/articles/${relatedArticle.id}`}
                  className="group overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm transition-all hover:shadow-md dark:border-gray-800 dark:bg-gray-900"
                >
                  {relatedArticle.imageUrl && (
                    <div className="relative aspect-video overflow-hidden bg-gray-100 dark:bg-gray-800">
                      <Image
                        src={relatedArticle.imageUrl}
                        alt={relatedArticle.title}
                        fill
                        sizes="(max-width: 768px) 100vw, 50vw"
                        className="object-cover transition-transform duration-300 group-hover:scale-105"
                      />
                    </div>
                  )}

                  <div className="p-4">
                    <h3 className="font-medium text-gray-900 group-hover:text-primary dark:text-white dark:group-hover:text-primary-400">
                      {relatedArticle.title}
                    </h3>

                    <div className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                      {new Date(relatedArticle.date).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                      })}
                    </div>
                  </div>
                </Link>
              ))}
          </div>
        </div>
      </article>
    </div>
  );
} 
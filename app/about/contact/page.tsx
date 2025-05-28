import React from 'react';
import { SimpleBreadcrumb } from '@/components/ui/breadcrumb';
import { PageHeading } from '@/components/ui/PageHeading';
import { MapPin, Phone, Mail, Clock, Globe } from 'lucide-react';

export const metadata = {
  title: '문의하기 - 서한에프앤씨',
  description: '서한에프앤씨에 문의하고 연락하는 방법과 위치 정보를 제공합니다.'
};

export default function ContactPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <SimpleBreadcrumb items={[
        { text: 'Home', href: '/' },
        { text: 'About', href: '/about' },
        { text: 'Contact', href: '/about/contact', active: true },
      ]} />

      <div className="mx-auto max-w-3xl py-12">
        <h1 className="mb-6 text-3xl font-bold tracking-tight text-gray-900 dark:text-white md:text-4xl">
          Contact Us
        </h1>

        <div className="prose max-w-none dark:prose-invert">
          <p className="text-lg leading-relaxed text-gray-700 dark:text-gray-300">
            Please contact us for more information about our products and services.
          </p>

          <div className="mt-8 grid grid-cols-1 gap-8 md:grid-cols-2">
            <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900">
              <h3 className="mb-3 text-xl font-semibold">Headquarters</h3>
              <address className="not-italic">
                <p>123 Business Street</p>
                <p>Seoul, South Korea</p>
                <p className="mt-3">
                  <strong>Tel:</strong> +82-2-1234-5678
                </p>
                <p>
                  <strong>Email:</strong> contact@seohan.com
                </p>
              </address>
            </div>

            <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900">
              <h3 className="mb-3 text-xl font-semibold">Sales Office</h3>
              <address className="not-italic">
                <p>456 Commerce Avenue</p>
                <p>Busan, South Korea</p>
                <p className="mt-3">
                  <strong>Tel:</strong> +82-51-9876-5432
                </p>
                <p>
                  <strong>Email:</strong> sales@seohan.com
                </p>
              </address>
            </div>
          </div>

          <h2 className="mt-10 mb-6 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
            Send Us a Message
          </h2>

          <form className="mt-6 space-y-6">
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Name
                </label>
                <input
                  type="text"
                  id="name"
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-primary focus:outline-none focus:ring-primary dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                  placeholder="Your name"
                />
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-primary focus:outline-none focus:ring-primary dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                  placeholder="your@email.com"
                />
              </div>
            </div>

            <div>
              <label htmlFor="subject" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Subject
              </label>
              <input
                type="text"
                id="subject"
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-primary focus:outline-none focus:ring-primary dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                placeholder="Subject of your message"
              />
            </div>

            <div>
              <label htmlFor="message" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Message
              </label>
              <textarea
                id="message"
                rows={6}
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-primary focus:outline-none focus:ring-primary dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                placeholder="Your message here..."
              ></textarea>
            </div>

            <div className="flex justify-end">
              <button
                type="submit"
                className="rounded-md bg-primary px-6 py-3 text-white shadow-sm hover:bg-primary-600 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 dark:bg-primary-600 dark:hover:bg-primary-500"
              >
                Send Message
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
} 
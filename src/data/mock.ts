import type { Post, Category, Tag } from '@/lib/types';

const mockCategories: Category[] = [
  { id: '1', name: 'Technology' },
  { id: '2', name: 'Travel' },
  { id: '3', name: 'Lifestyle' },
];

const mockTags: Tag[] = [
  { id: '1', name: 'Next.js' },
  { id: '2', name: 'React' },
  { id: '3', name: 'Design' },
  { id: '4', name: 'Productivity' },
];

export const mockPosts: Post[] = [
  {
    id: '1',
    title: 'Getting Started with Next.js 15',
    slug: 'getting-started-nextjs-15',
    author: 'Admin User',
    createdAt: '2024-05-01T10:00:00Z',
    // imageUrl: 'https://placehold.co/600x400.png', // Removed
    // imageHint: 'code editor', // Removed
    content: '<p class="font-serif">Next.js 15 introduces a host of new features aimed at improving developer experience and application performance. In this post, we will explore some of the key highlights and how you can leverage them in your projects.</p><h3 class="font-sans">Key Features:</h3><ul class="font-serif"><li>React Compiler (Experimental)</li><li>Caching improvements</li><li>Partial Prerendering (Stable)</li></ul><p class="font-serif">These updates promise to make building complex web applications more efficient and performant.</p>',
    category: mockCategories[0],
    tags: [mockTags[0], mockTags[1]],
  },
  {
    id: '2',
    title: 'Exploring the Mountains of Patagonia',
    slug: 'exploring-patagonia-mountains',
    author: 'Editor User',
    createdAt: '2024-05-05T14:30:00Z',
    // imageUrl: 'https://placehold.co/600x400.png', // Removed
    // imageHint: 'mountain landscape', // Removed
    content: '<p class="font-serif">Patagonia, a region at the southern end of South America, is renowned for its dramatic mountain peaks, glaciers, and pristine wilderness. This travelogue shares experiences from a recent trek through its breathtaking landscapes.</p><p class="font-serif">From the iconic Fitz Roy massif to the stunning Torres del Paine National Park, every view is a postcard. We encountered diverse wildlife and navigated challenging terrains, making it an unforgettable adventure.</p>',
    category: mockCategories[1],
    tags: [],
  },
  {
    id: '3',
    title: 'The Art of Minimalist Living',
    slug: 'art-minimalist-living',
    author: 'Contributor User',
    createdAt: '2024-05-10T09:15:00Z',
    // imageUrl: 'https://placehold.co/600x400.png', // Removed
    // imageHint: 'minimalist interior', // Removed
    content: "<p class=\"font-serif\">Minimalism is more than just an aesthetic; it's a lifestyle choice focused on living with less. This post delves into the principles of minimalist living and offers practical tips for decluttering your life and mind.</p><p class=\"font-serif\">Benefits include reduced stress, more financial freedom, and a greater appreciation for the things that truly matter. It's a journey of intentionality and finding joy in simplicity.</p>",
    category: mockCategories[2],
    tags: [mockTags[2], mockTags[3]],
  },
  {
    id: '4',
    title: 'Advanced TypeScript Techniques for Modern Web Development',
    slug: 'advanced-typescript-techniques',
    author: 'Admin User',
    createdAt: '2024-05-15T11:00:00Z',
    // imageUrl: 'https://placehold.co/600x400.png', // Removed
    // imageHint: 'typescript logo', // Removed
    content: "<p class=\"font-serif\">TypeScript has become an essential tool for building robust and scalable web applications. This article explores advanced techniques such as conditional types, mapped types, and utility types that can significantly enhance your development workflow.</p><p class=\"font-serif\">Understanding these concepts can lead to more maintainable code, better type safety, and improved collaboration within development teams. We'll walk through practical examples to illustrate their usage.</p>",
    category: mockCategories[0],
    tags: [mockTags[0], mockTags[1]],
  }
];

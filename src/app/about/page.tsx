
import type { Metadata } from 'next';
import Image from 'next/image';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { APP_NAME } from '@/lib/constants';

export const metadata: Metadata = {
  title: `About Me | ${APP_NAME}`,
  description: 'Learn more about the author.',
};

export default function AboutPage() {
  return (
    <div className="max-w-3xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
      <Card className="overflow-hidden shadow-lg">
        <CardHeader className="bg-muted/30 p-6">
          <div className="flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-6">
            <div className="relative h-32 w-32 sm:h-40 sm:w-40 rounded-full overflow-hidden ring-2 ring-primary shadow-md">
              <Image
                src="https://placehold.co/300x300.png"
                alt="My Profile Picture"
                layout="fill"
                objectFit="cover"
                data-ai-hint="profile picture"
              />
            </div>
            <div className="text-center sm:text-left">
              <CardTitle className="text-3xl font-bold font-sans">
                Your Name Here
              </CardTitle>
              <p className="text-lg text-muted-foreground font-sans">
                Your Title / Role (e.g., Lead Developer, Content Creator)
              </p>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-6 space-y-6">
          <section>
            <h2 className="text-2xl font-semibold mb-3 font-sans">About Me</h2>
            <Separator className="mb-4" />
            <div className="prose prose-lg dark:prose-invert max-w-none font-serif space-y-4">
              <p>
                Hello! I'm [Your Name], and this is a space where I can share a bit about myself. 
                Replace this text with your own biography. Talk about your passions, your work, 
                your journey, or anything else you'd like to share with your readers.
              </p>
              <p>
                This section can be as long or as short as you like. You can use multiple paragraphs
                to structure your thoughts. For example, you might want to discuss your professional
                experience, your hobbies, or your vision for this blog.
              </p>
              <p>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor 
                incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud 
                exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute 
                irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla 
                pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia 
                deserunt mollit anim id est laborum.
              </p>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-3 font-sans">My Skills</h2>
            <Separator className="mb-4" />
            <div className="flex flex-wrap gap-2 font-sans">
              {['React', 'Next.js', 'Tailwind CSS', 'TypeScript', 'Node.js', 'Content Creation', 'AI Integration'].map(skill => (
                <span key={skill} className="bg-secondary text-secondary-foreground px-3 py-1 rounded-full text-sm">
                  {skill}
                </span>
              ))}
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-3 font-sans">Contact</h2>
            <Separator className="mb-4" />
            <p className="font-serif text-muted-foreground">
              You can reach out to me via email at <a href="mailto:your.email@example.com" className="text-primary hover:underline">your.email@example.com</a> or connect with me on 
              {' '}<a href="#" className="text-primary hover:underline">LinkedIn</a> (replace with your actual link).
            </p>
          </section>

        </CardContent>
      </Card>
    </div>
  );
}

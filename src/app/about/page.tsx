
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
                src="/profile-picture.jpg" // This path looks for 'public/profile-picture.jpg'
                alt="Ajay Kumar - Profile Picture"
                layout="fill"
                objectFit="cover"
                data-ai-hint="profile picture"
              />
            </div>
            <div className="text-center sm:text-left">
              <CardTitle className="text-3xl font-bold font-sans">
                Ajay Kumar
              </CardTitle>
              <p className="text-lg text-muted-foreground font-sans">
                Test Automation Architect | AI Enthusiast
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
                I am an experienced Test Automation Architect with a strong background in quality assurance and software testing, particularly within the telecommunications industry. Over the years, I have led and delivered robust automation solutions for enterprise-scale projects.
              </p>
              <p>
                Driven by curiosity and a passion for innovation, I am now focused on expanding my expertise in artificial intelligence. My current interests include:
              </p>
              <ul>
                <li>RAG (Retrieval-Augmented Generation) Development</li>
                <li>Agentic AI Solutions for Testing</li>
                <li>Custom AI Applications for Automation and Quality Assurance</li>
                <li>Integrating AI into Test Strategy, Execution, and Reporting</li>
              </ul>
              <p>
                My goal is to grow my skills in AI and build custom solutions that create real value for businesses and users alike.
              </p>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-3 font-sans">My Skills</h2>
            <Separator className="mb-4" />
            <div className="flex flex-wrap gap-2 font-sans">
              {['Test Automation', 'QA', 'AI/ML', 'RAG', 'Agentic AI', 'Next.js', 'React', 'TypeScript', 'Python'].map(skill => (
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
              You can reach out to me via email at <a href="mailto:ajuu03@gmail.com" className="text-primary hover:underline">ajuu03@gmail.com</a> or connect with me on
              {' '}<a href="https://linkedin.com/in/ajay-kumar-6897a14b" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">LinkedIn</a>.
            </p>
          </section>

        </CardContent>
      </Card>
    </div>
  );
}

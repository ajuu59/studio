
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export function NewVerticalSection() {
  return (
    <Card className="sticky top-20 shadow-md">
      <CardHeader>
        <CardTitle className="text-xl font-sans flex items-center">
          {/* You can add an icon here if desired, e.g., <YourIcon className="mr-2 h-5 w-5 text-primary" /> */}
          New Section
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground text-sm">
          This is content for the new vertical section.
          You can customize this as needed.
        </p>
        {/* Example: Add more complex content or components here */}
        {/* <div className="mt-4 space-y-2">
          <p className="text-sm">Item 1</p>
          <p className="text-sm">Item 2</p>
        </div> */}
      </CardContent>
    </Card>
  );
}

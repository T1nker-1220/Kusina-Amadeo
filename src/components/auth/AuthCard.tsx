import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card';
import { cn } from '@/lib/utils';

interface AuthCardProps {
  children: React.ReactNode;
  title: string;
  description?: string;
  className?: string;
}

export function AuthCard({ children, title, description, className }: AuthCardProps) {
  return (
    <div className="container relative min-h-screen flex-col items-center justify-center grid lg:max-w-none lg:grid-cols-2 lg:px-0">
      <div className="relative hidden h-full flex-col bg-muted p-10 text-white lg:flex dark:border-r">
        <div className="absolute inset-0 bg-brand-900" />
        <div className="relative z-20 flex items-center text-lg font-medium">
          <img src="/images/logo.png" alt="Kusina De Amadeo" className="h-12" />
        </div>
        <div className="relative z-20 mt-auto">
          <blockquote className="space-y-2">
            <p className="text-lg">
              "Experience the authentic taste of Filipino cuisine at Kusina De Amadeo. 
              Where every dish tells a story of tradition and flavor."
            </p>
            <footer className="text-sm">Kusina De Amadeo Team</footer>
          </blockquote>
        </div>
      </div>
      <div className="lg:p-8">
        <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
          <Card className={cn("w-full", className)}>
            <CardHeader>
              <CardTitle>{title}</CardTitle>
              {description && <CardDescription>{description}</CardDescription>}
            </CardHeader>
            <CardContent>{children}</CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

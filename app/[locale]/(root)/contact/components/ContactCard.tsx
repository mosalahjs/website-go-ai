import { Card, CardContent } from "@/components/ui/card";

type ContactCardProps = {
  icon: React.ElementType;
  title: string;
  value: string;
  link?: string | null;
};

export function ContactCard({
  icon: Icon,
  title,
  value,
  link,
}: ContactCardProps) {
  return (
    <Card className="border-border/40 hover:border-primary/40 transition-all duration-300">
      <CardContent className="p-6">
        <div className="flex items-start space-x-4">
          <div className="flex-shrink-0 p-3 rounded-lg bg-primary/10">
            <Icon className="h-6 w-6 text-primary" />
          </div>
          <div>
            <div className="font-semibold mb-1">{title}</div>
            {link ? (
              <a
                href={link}
                className="text-muted-foreground hover:text-primary transition-colors"
              >
                {value}
              </a>
            ) : (
              <div className="text-muted-foreground">{value}</div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

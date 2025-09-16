import { cn } from "@/lib/utils";

interface PageHeaderProps {
    title: string;
    description: string;
}

export function PageHeader({ title, description }: PageHeaderProps) {
    return (
        <div className="flex flex-col gap-1">
            <h1 className="text-3xl font-bold tracking-tight font-headline gradient-text">
                {title}
            </h1>
            <p className="text-muted-foreground">{description}</p>
        </div>
    );
}

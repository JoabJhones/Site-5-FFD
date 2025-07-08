"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import * as LucideIcons from "lucide-react";
import { Menu } from "lucide-react";

import { cn } from "@/lib/utils";
import { navLinks } from "@/lib/content";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

type IconName = keyof typeof LucideIcons;

const DynamicIcon = ({ name }: { name: IconName }) => {
  const IconComponent = LucideIcons[name] as React.FC<React.SVGProps<SVGSVGElement>>;
  if (!IconComponent) return null;
  return <IconComponent className="h-5 w-5" />;
};


export default function Header() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 max-w-screen-2xl items-center">
        <Link href="/" className="mr-6 flex items-center space-x-3">
          <Image
            src="https://media.licdn.com/dms/image/v2/D4E0BAQG308qmO_jpZQ/company-logo_200_200/company-logo_200_200/0/1680554352386/frango_dourado_alimentos_logo?e=2147483647&v=beta&t=0rmtOkXVEFxisvele33NIShETEfYctlbAnQjNVQMNW0"
            alt="Logo Frango Dourado"
            width={48}
            height={48}
            className="rounded-full shadow-md object-cover"
          />
          <span className="hidden font-bold sm:inline-block text-xl">
            Frango Dourado
          </span>
        </Link>

        <nav className="hidden md:flex flex-1 items-center space-x-6 text-sm font-medium">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "transition-colors hover:text-primary",
                pathname === link.href ? "text-primary" : "text-foreground/60"
              )}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex flex-1 items-center justify-end space-x-4">
            <Button asChild className="hidden md:flex">
                <Link href="/contato">Fale Conosco</Link>
            </Button>
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden">
                <Menu className="h-6 w-6" />
                <span className="sr-only">Toggle Menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right">
              <div className="flex flex-col gap-6 pt-6">
                <Link href="/" className="flex items-center space-x-2">
                    <Image
                        src="https://media.licdn.com/dms/image/v2/D4E0BAQG308qmO_jpZQ/company-logo_200_200/company-logo_200_200/0/1680554352386/frango_dourado_alimentos_logo?e=2147483647&v=beta&t=0rmtOkXVEFxisvele33NIShETEfYctlbAnQjNVQMNW0"
                        alt="Logo Frango Dourado"
                        width={40}
                        height={40}
                        className="rounded-full shadow-md object-cover"
                    />
                    <span className="font-bold">Frango Dourado</span>
                </Link>
                <div className="flex flex-col gap-3">
                  {navLinks.map((link) => (
                     <Link
                      key={link.href}
                      href={link.href}
                      className={cn(
                        "flex items-center gap-3 rounded-lg p-3 transition-colors hover:bg-muted",
                        pathname === link.href ? "bg-muted text-primary" : "text-foreground/70"
                      )}
                    >
                      <DynamicIcon name={link.icon as IconName} />
                      {link.label}
                    </Link>
                  ))}
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}

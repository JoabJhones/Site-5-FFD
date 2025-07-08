"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { footerContent } from '@/lib/content';

const FacebookIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg {...props} fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
        <path fillRule="evenodd" d="M12 2C6.477 2 2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.776-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33V22h6.78c5.523 0 10-4.477 10-10S17.523 2 12 2z" clipRule="evenodd" />
    </svg>
);

const InstagramIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg {...props} fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.85s-.011 3.585-.069 4.85c-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07s-3.585-.012-4.85-.07c-3.252-.148-4.771-1.691-4.919-4.919-.058-1.265-.069-1.645-.069-4.85s.011-3.585.069-4.85c.149-3.225 1.664-4.771 4.919-4.919C8.415 2.175 8.796 2.163 12 2.163zm0 1.441c-3.141 0-3.504.012-4.71.068-2.7.123-3.972 1.393-4.096 4.096-.055 1.205-.067 1.562-.067 4.71s.012 3.505.067 4.71c.124 2.703 1.396 3.972 4.096 4.096 1.206.055 1.569.067 4.71.067s3.504-.012 4.71-.067c2.7-.124 3.972-1.393 4.096-4.096.055-1.205.067-1.562.067-4.71s-.012-3.505-.067-4.71c-.124-2.703-1.396-3.972-4.096-4.096-1.206-.055-1.569-.067-4.71-.067zm0 3.843c-2.403 0-4.35 1.947-4.35 4.35s1.947 4.35 4.35 4.35 4.35-1.947 4.35-4.35-1.947-4.35-4.35-4.35zm0 7.252c-1.601 0-2.901-1.3-2.901-2.901s1.3-2.901 2.901-2.901 2.901 1.3 2.901 2.901-1.3 2.901-2.901 2.901zm4.65-6.72c-.777 0-1.408.631-1.408 1.408s.631 1.408 1.408 1.408c.777 0 1.408-.631 1.408-1.408s-.631-1.408-1.408-1.408z" />
    </svg>
);


export default function Footer() {
  const [input, setInput] = useState('');
  const router = useRouter();
  const [year, setYear] = useState(new Date().getFullYear());

  useEffect(() => {
    setYear(new Date().getFullYear());
    
    const onKeydown = (e: KeyboardEvent) => {
      if (document.activeElement?.tagName === 'INPUT' || document.activeElement?.tagName === 'TEXTAREA') {
        return;
      }
      
      const newKey = e.key.toLowerCase();
      if (newKey.length === 1 && 'abcdefghijklmnopqrstuvwxyz'.includes(newKey)) {
        setInput(prev => (prev + newKey).slice(-5));
      } else if (newKey === 'backspace') {
        setInput(prev => prev.slice(0, -1));
      }
    };
    
    window.addEventListener('keydown', onKeydown);
    return () => window.removeEventListener('keydown', onKeydown);
  }, []);

  useEffect(() => {
    if (input.toLowerCase() === 'admin') {
      router.push('/admin');
      setInput(''); 
    }
  }, [input, router]);


  return (
    <footer className="bg-secondary text-secondary-foreground">
      <div className="container mx-auto py-8 px-6 text-center">
        <p className="font-semibold">&copy; {year} {footerContent.copyright}</p>
        <p className="text-sm mt-2">{footerContent.address}</p>
        <p className="text-sm mt-1">{footerContent.contact}</p>
        <div className="flex justify-center space-x-4 mt-4">
            <Link href="#" className="text-secondary-foreground hover:text-primary transition-colors">
                <FacebookIcon className="w-6 h-6" />
            </Link>
            <Link href="#" className="text-secondary-foreground hover:text-primary transition-colors">
                <InstagramIcon className="w-6 h-6" />
            </Link>
        </div>
      </div>
    </footer>
  );
}

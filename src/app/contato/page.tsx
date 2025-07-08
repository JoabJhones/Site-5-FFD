import { contactPageContent } from '@/lib/content';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Mail, Phone, MapPin, Clock } from 'lucide-react';
import ContactForm from './ContactForm';

export default function ContatoPage() {
  return (
    <div className="container mx-auto px-4 py-16 lg:py-24">
      <div className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-extrabold text-primary tracking-tight">
          {contactPageContent.title}
        </h1>
        <p className="mt-4 max-w-3xl mx-auto text-lg text-foreground/80">
          {contactPageContent.intro}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="text-3xl font-bold">{contactPageContent.formTitle}</CardTitle>
          </CardHeader>
          <CardContent>
            <ContactForm />
          </CardContent>
        </Card>

        <div className="space-y-8">
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="text-3xl font-bold">{contactPageContent.detailsTitle}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-lg">
              <p className="flex items-center gap-3">
                <Mail className="h-6 w-6 text-primary" />
                <a href={`mailto:${contactPageContent.email}`} className="hover:text-primary transition-colors">{contactPageContent.email}</a>
              </p>
              <p className="flex items-center gap-3">
                <Phone className="h-6 w-6 text-primary" />
                <a href={`tel:${contactPageContent.phone.replace(/\D/g, '')}`} className="hover:text-primary transition-colors">{contactPageContent.phone}</a>
              </p>
              <p className="flex items-center gap-3">
                <MapPin className="h-6 w-6 text-primary" />
                <span>{contactPageContent.address}</span>
              </p>
              <p className="flex items-center gap-3">
                <Clock className="h-6 w-6 text-primary" />
                <span>{contactPageContent.hours}</span>
              </p>
            </CardContent>
          </Card>

          <Card className="shadow-lg overflow-hidden">
            <div className="aspect-w-16 aspect-h-9">
              <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3954.191295204423!2d-35.1009137!3d-7.9254054!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x7ab182281a8b13d%3A0x289b4f9f4a1f6a1d!2sRua%20Sizenando%20Carneiro%20Le%C3%A3o%2C%2010%20-%20Centro%2C%20Carpina%20-%20PE%2C%2055819-000!5e0!3m2!1spt-BR!2sbr!4v1700000000000!5m2!1spt-BR!2sbr"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen={true}
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="Localização Frango Dourado"
              ></iframe>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}

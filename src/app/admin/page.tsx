"use client";

import { useState } from "react";
import { Shield, Settings, ShoppingBag, Home, Award, Mail } from "lucide-react";
import AdminLogin from "./AdminLogin";
import ProductManager from "./ProductManager";
import AboutManager from "./AboutManager";
import HomeManager from "./HomeManager";
import QualityManager from "./QualityManager";
import ContactManager from "./ContactManager";
import { Button } from "@/components/ui/button";

type ActiveManager = 'products' | 'about' | 'home' | 'quality' | 'contact';

export default function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [activeManager, setActiveManager] = useState<ActiveManager | null>(null);

  const handleLoginSuccess = () => {
    setIsAuthenticated(true);
  };

  if (!isAuthenticated) {
    return <AdminLogin onLoginSuccess={handleLoginSuccess} />;
  }

  return (
    <div className="min-h-screen bg-muted">
      <div className="container mx-auto px-4 py-12">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
            <div className="flex items-center gap-4">
                <Shield className="h-10 w-10 text-primary" />
                <div>
                    <h1 className="text-4xl font-bold">Painel de Administração</h1>
                    <p className="text-muted-foreground">Gerencie o conteúdo do seu site.</p>
                </div>
            </div>
            <div className="flex flex-wrap gap-2">
                <Button onClick={() => setActiveManager('home')} variant={activeManager === 'home' ? 'default' : 'outline'}>
                    <Home className="mr-2 h-4 w-4" />
                    Gerenciar Início
                </Button>
                <Button onClick={() => setActiveManager('about')} variant={activeManager === 'about' ? 'default' : 'outline'}>
                    <Settings className="mr-2 h-4 w-4" />
                    Gerenciar Sobre Nós
                </Button>
                <Button onClick={() => setActiveManager('products')} variant={activeManager === 'products' ? 'default' : 'outline'}>
                    <ShoppingBag className="mr-2 h-4 w-4" />
                    Gerenciar Produtos
                </Button>
                <Button onClick={() => setActiveManager('quality')} variant={activeManager === 'quality' ? 'default' : 'outline'}>
                    <Award className="mr-2 h-4 w-4" />
                    Gerenciar Qualidade
                </Button>
                <Button onClick={() => setActiveManager('contact')} variant={activeManager === 'contact' ? 'default' : 'outline'}>
                    <Mail className="mr-2 h-4 w-4" />
                    Gerenciar Contato
                </Button>
            </div>
        </div>
        
        <div className="mt-8">
          {activeManager === 'home' && <HomeManager />}
          {activeManager === 'about' && <AboutManager />}
          {activeManager === 'products' && <ProductManager />}
          {activeManager === 'quality' && <QualityManager />}
          {activeManager === 'contact' && <ContactManager />}
          {!activeManager && (
            <div className="text-center py-20 bg-card rounded-lg shadow-sm">
                <h2 className="text-2xl font-semibold text-muted-foreground">Selecione uma área para gerenciar.</h2>
                <p className="text-muted-foreground mt-2">Clique em um dos botões acima para começar a editar.</p>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}

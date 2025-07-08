"use client";

import { useState } from "react";
import { Shield } from "lucide-react";
import OptimizerClient from "./OptimizerClient";
import AdminLogin from "./AdminLogin";
import ProductManager from "./ProductManager";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";


export default function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const handleLoginSuccess = () => {
    setIsAuthenticated(true);
  };

  if (!isAuthenticated) {
    // Renderiza a tela de login se não estiver autenticado
    return <AdminLogin onLoginSuccess={handleLoginSuccess} />;
  }

  // Renderiza o painel de administração após o login bem-sucedido
  return (
    <div className="min-h-screen bg-muted">
      <div className="container mx-auto px-4 py-12">
        <div className="flex items-center gap-4 mb-8">
            <Shield className="h-10 w-10 text-primary" />
            <div>
                <h1 className="text-4xl font-bold">Painel de Administração</h1>
                <p className="text-muted-foreground">Gerenciamento de conteúdo com otimização por IA.</p>
            </div>
        </div>
        
        <Tabs defaultValue="optimizer" className="w-full">
          <TabsList className="grid w-full grid-cols-2 max-w-md mb-6">
            <TabsTrigger value="optimizer">Otimizador de Conteúdo</TabsTrigger>
            <TabsTrigger value="products">Gerenciador de Produtos</TabsTrigger>
          </TabsList>
          <TabsContent value="optimizer">
            <OptimizerClient />
          </TabsContent>
          <TabsContent value="products">
            <ProductManager />
          </TabsContent>
        </Tabs>

      </div>
    </div>
  );
}

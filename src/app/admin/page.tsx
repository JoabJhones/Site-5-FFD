import { Shield } from "lucide-react";
import OptimizerClient from "./OptimizerClient";

export default function AdminPage() {
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

        <OptimizerClient />
      </div>
    </div>
  );
}

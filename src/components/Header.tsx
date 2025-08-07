import { FileText } from "lucide-react";

const Header = () => {
  return (
    <header className="bg-card border-b border-border py-4 px-6">
      <div className="container mx-auto flex items-center gap-3">
        <div className="flex items-center gap-2">
          <FileText className="h-8 w-8 text-primary" />
          <h1 className="text-2xl font-bold text-foreground">AuthCard OCR</h1>
        </div>
        <nav className="ml-auto">
          <div className="text-sm text-muted-foreground">
            Extract text from authentication cards
          </div>
        </nav>
      </div>
    </header>
  );
};

export default Header;
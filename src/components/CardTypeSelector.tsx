import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { CreditCard, IdCard, Shield } from "lucide-react";

interface CardTypeSelectorProps {
  selectedType: string | null;
  onTypeSelect: (type: string) => void;
}

const cardTypes = [
  {
    id: "id_card",
    name: "ID Card",
    description: "National ID, Driver's License",
    icon: IdCard,
  },
  {
    id: "passport",
    name: "Passport",
    description: "International Passport",
    icon: Shield,
  },
  {
    id: "credit_card",
    name: "Credit Card",
    description: "Bank Cards, Credit/Debit",
    icon: CreditCard,
  },
];

const CardTypeSelector = ({ selectedType, onTypeSelect }: CardTypeSelectorProps) => {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-foreground">Select Card Type</h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {cardTypes.map((type) => {
          const Icon = type.icon;
          const isSelected = selectedType === type.id;
          
          return (
            <Card
              key={type.id}
              className={`p-6 cursor-pointer transition-all duration-200 border-2 ${
                isSelected 
                  ? 'border-primary bg-accent' 
                  : 'border-border hover:border-primary-light hover:bg-accent/50'
              }`}
              onClick={() => onTypeSelect(type.id)}
            >
              <div className="text-center space-y-3">
                <Icon className={`h-8 w-8 mx-auto ${isSelected ? 'text-primary' : 'text-muted-foreground'}`} />
                <h4 className={`font-medium ${isSelected ? 'text-primary' : 'text-foreground'}`}>
                  {type.name}
                </h4>
                <p className="text-sm text-muted-foreground">{type.description}</p>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
};

export default CardTypeSelector;
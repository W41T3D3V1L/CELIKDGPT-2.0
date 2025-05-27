"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Info } from "lucide-react";

interface ContractDisplayProps {
  contractText: string;
}

export function ContractDisplay({ contractText }: ContractDisplayProps) {
  return (
    <Card className="mb-4 border-accent/70 bg-card shadow-lg sticky top-0 z-10">
      <CardHeader className="pb-2 pt-3">
        <CardTitle className="flex items-center text-sm font-medium text-accent">
          <Info className="w-4 h-4 mr-2 neon-icon" />
          Operating Contract: Directive 7.0 Active
        </CardTitle>
      </CardHeader>
      <CardContent className="text-xs text-muted-foreground max-h-24 overflow-y-auto whitespace-pre-wrap py-2">
        {contractText}
      </CardContent>
    </Card>
  );
}

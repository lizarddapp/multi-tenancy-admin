import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "~/components/ui/card";
import { Button } from "~/components/ui/button";
import { Badge } from "~/components/ui/badge";
import { CreditCard, Plus, Trash2 } from "lucide-react";
import { AddPaymentMethodDialog } from "./add-payment-method-dialog";
import type { Billing } from "~/types/dashboard";

interface PaymentMethodCardProps {
  billing: Billing;
}

export function PaymentMethodCard({ billing }: PaymentMethodCardProps) {
  const [showAddPaymentDialog, setShowAddPaymentDialog] = useState(false);

  const hasPaymentMethod = !!billing.stripeCustomerId;

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CreditCard className="h-5 w-5" />
            Payment Methods
          </CardTitle>
          <CardDescription>
            Manage your payment methods and billing information
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {hasPaymentMethod ? (
            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div className="flex items-center gap-3">
                <div className="w-10 h-6 bg-blue-600 rounded flex items-center justify-center">
                  <span className="text-white text-xs font-bold">VISA</span>
                </div>
                <div>
                  <p className="font-medium">•••• •••• •••• 4242</p>
                  <p className="text-sm text-muted-foreground">Expires 12/25</p>
                </div>
                <Badge variant="secondary">Default</Badge>
              </div>
              <Button variant="outline" size="sm">
                <Trash2 className="h-4 w-4 mr-2" />
                Remove
              </Button>
            </div>
          ) : (
            <div className="text-center py-8 border-2 border-dashed border-gray-200 rounded-lg">
              <CreditCard className="h-8 w-8 mx-auto text-gray-400 mb-2" />
              <p className="text-muted-foreground mb-4">No payment method added</p>
              <Button onClick={() => setShowAddPaymentDialog(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Add Payment Method
              </Button>
            </div>
          )}

          {hasPaymentMethod && (
            <Button 
              variant="outline" 
              className="w-full"
              onClick={() => setShowAddPaymentDialog(true)}
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Another Payment Method
            </Button>
          )}
        </CardContent>
      </Card>

      <AddPaymentMethodDialog
        open={showAddPaymentDialog}
        onOpenChange={setShowAddPaymentDialog}
        billing={billing}
      />
    </>
  );
}

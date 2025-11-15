import { Store, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export type UserRole = "customer" | "owner" | null;

export const Login = ({ onLogin }: { onLogin: (role: UserRole) => void }) => {
    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-primary/10 via-background to-secondary/10">
            <div className="text-center mb-12">
                <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                    Welcome to Wolt
                </h1>
                <p className="text-xl text-muted-foreground">Choose how you want to continue</p>
            </div>

            <div className="grid md:grid-cols-2 gap-8 max-w-4xl px-4">
                {/* Customer Card */}
                <Card
                    className="p-8 hover:shadow-2xl transition-all cursor-pointer border-2 hover:border-primary"
                    onClick={() => onLogin("customer")}
                >
                    <div className="text-center">
                        <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-6">
                            <Users className="w-10 h-10 text-primary" />
                        </div>
                        <h2 className="text-2xl font-bold mb-3">I'm a Customer</h2>
                        <p className="text-muted-foreground mb-6">
                            Browse restaurants, view menu items with calorie information, and place orders
                        </p>
                        <Button size="lg" className="w-full">
                            Continue as Customer
                        </Button>
                    </div>
                </Card>

                {/* Restaurant Owner Card */}
                <Card
                    className="p-8 hover:shadow-2xl transition-all cursor-pointer border-2 hover:border-secondary"
                    onClick={() => onLogin("owner")}
                >
                    <div className="text-center">
                        <div className="w-20 h-20 rounded-full bg-secondary/10 flex items-center justify-center mx-auto mb-6">
                            <Store className="w-10 h-10 text-secondary" />
                        </div>
                        <h2 className="text-2xl font-bold mb-3">I'm a Restaurant Owner</h2>
                        <p className="text-muted-foreground mb-6">
                            Add your menu items, scan food images for automatic calorie detection
                        </p>
                        <Button size="lg" variant="secondary" className="w-full">
                            Continue as Owner
                        </Button>
                    </div>
                </Card>
            </div>
        </div>
    );
};

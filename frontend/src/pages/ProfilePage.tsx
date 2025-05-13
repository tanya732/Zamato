import React from "react";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { TopNav } from "@/components/layout/TopNav";
import { Footer } from "@/components/layout/Footer";
import { Avatar } from "@/components/ui/avatar";
import { BadgeCheck, Mail, Phone, MapPin, Calendar, User } from "lucide-react";

export const ProfilePage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-foodly-primary/10 via-white to-foodly-primary/5">
      <TopNav />
      <div className="container-custom flex flex-col items-center justify-center py-16">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="w-full max-w-md"
        >
          <Card className="shadow-2xl rounded-2xl border-0 bg-white/90 backdrop-blur-md">
            <CardContent className="p-8 flex flex-col items-center">
              <div className="relative mb-4">
                <Avatar className="h-24 w-24 ring-4 ring-foodly-primary/20 shadow-lg" />
                <span className="absolute bottom-2 right-2 bg-foodly-primary rounded-full p-1">
                  <BadgeCheck className="h-5 w-5 text-white" />
                </span>
              </div>
              <h2 className="mb-1 text-3xl font-extrabold text-foodly-primary flex items-center gap-2">
                Jane Doe
                <User className="h-5 w-5 text-foodly-primary/70" />
              </h2>
              <p className="mb-2 text-base text-muted-foreground flex items-center gap-2">
                <Mail className="h-4 w-4" /> janedoe@email.com
              </p>
              <div className="mb-4 text-sm text-foodly-primary font-semibold px-3 py-1 rounded-full bg-foodly-primary/10">
                Premium Member
              </div>
              <div className="w-full mt-4 space-y-3">
                <div className="flex items-center gap-2">
                  <Phone className="h-4 w-4 text-foodly-primary" />
                  <span className="font-medium w-24">Phone:</span>
                  <span className="text-muted-foreground">+1 555-123-4567</span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-foodly-primary" />
                  <span className="font-medium w-24">Address:</span>
                  <span className="text-muted-foreground">123 Main St, Springfield</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-foodly-primary" />
                  <span className="font-medium w-24">Joined:</span>
                  <span className="text-muted-foreground">Jan 2023</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-medium w-24">Birthday:</span>
                  <span className="text-muted-foreground">March 14, 1995</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-medium w-24">Loyalty Points:</span>
                  <span className="text-foodly-primary font-bold">2,450</span>
                </div>
              </div>
              <Button className="mt-8 w-full bg-foodly-primary hover:bg-foodly-primary/90 transition-all shadow-md text-lg font-semibold py-6 rounded-xl">
                Edit Profile
              </Button>
            </CardContent>
          </Card>
        </motion.div>
      </div>
      <Footer />
    </div>
  );
};

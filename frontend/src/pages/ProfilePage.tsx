import React from "react";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { TopNav } from "@/components/layout/TopNav";
import { Footer } from "@/components/layout/Footer";
import { Avatar } from "@/components/ui/avatar";
import {
  BadgeCheck, Mail, Phone, MapPin, Calendar, User, Star, Settings, ChevronRight, ShoppingBag, Heart, Home
} from "lucide-react";

export const ProfilePage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-foodly-primary/10 via-white to-foodly-primary/5">
      <TopNav />
      <div className="container-custom flex flex-col items-center justify-center py-16">
        <div className="flex flex-col gap-8 w-full max-w-6xl md:flex-row md:items-start md:justify-center">
          {/* Profile Card */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="w-full max-w-md md:max-w-sm"
          >
            <Card className="shadow-2xl rounded-2xl border-0 bg-white/90 backdrop-blur-md">
              <CardContent className="p-8 flex flex-col items-center">
                <div className="relative mb-4">
                  <Avatar className="h-24 w-24 ring-4 ring-foodly-primary/20 shadow-lg">
                    <img
                      src="https://ui-avatars.com/api/?name=Jane+Doe&background=foodly-primary&color=fff&size=128"
                      alt="Jane Doe"
                      className="h-24 w-24 rounded-full object-cover"
                    />
                  </Avatar>
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

          {/* Extra Cards */}
          <div className="flex flex-col gap-6 w-full md:w-[32rem]">
            {/* Recent Orders Card */}
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <Card className="rounded-xl shadow-lg border-0 bg-white/95 hover:shadow-2xl transition-all cursor-pointer group">
                <CardContent className="p-6">
                  <div className="flex items-center gap-3 mb-2">
                    <ShoppingBag className="h-6 w-6 text-foodly-primary" />
                    <span className="text-lg font-semibold text-foodly-primary">Recent Orders</span>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="font-medium">Pizza Palace</span>
                      <span className="text-xs text-muted-foreground">2 days ago</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="font-medium">Sushi World</span>
                      <span className="text-xs text-muted-foreground">5 days ago</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="font-medium">Burger Hub</span>
                      <span className="text-xs text-muted-foreground">1 week ago</span>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    className="mt-4 w-full flex items-center justify-between text-foodly-primary group-hover:underline"
                  >
                    View All Orders <ChevronRight className="h-4 w-4 ml-1" />
                  </Button>
                </CardContent>
              </Card>
            </motion.div>

            {/* Loyalty Card */}
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <Card className="rounded-xl shadow-lg border-0 bg-gradient-to-tr from-foodly-primary/20 to-white/80">
                <CardContent className="p-6">
                  <div className="flex items-center gap-3 mb-2">
                    <Star className="h-6 w-6 text-yellow-400" />
                    <span className="text-lg font-semibold text-foodly-primary">Loyalty Program</span>
                  </div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium">Points</span>
                    <span className="font-bold text-foodly-primary">2,450</span>
                  </div>
                  <div className="w-full bg-foodly-primary/10 rounded-full h-3 mb-2">
                    <div className="bg-foodly-primary h-3 rounded-full transition-all" style={{ width: "65%" }} />
                  </div>
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>Silver</span>
                    <span>Gold</span>
                  </div>
                  <Button
                    variant="outline"
                    className="mt-4 w-full border-foodly-primary text-foodly-primary hover:bg-foodly-primary/10"
                  >
                    Redeem Rewards
                  </Button>
                </CardContent>
              </Card>
            </motion.div>

            {/* Favorites Card */}
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.25 }}
            >
              <Card className="rounded-xl shadow-lg border-0 bg-white/95">
                <CardContent className="p-6">
                  <div className="flex items-center gap-3 mb-2">
                    <Heart className="h-6 w-6 text-pink-500" />
                    <span className="text-lg font-semibold text-foodly-primary">Favorites</span>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <span className="font-medium">Sushi World</span>
                      <span className="text-xs text-muted-foreground">Restaurant</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="font-medium">Spicy Paneer Pizza</span>
                      <span className="text-xs text-muted-foreground">Dish</span>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    className="mt-4 w-full flex items-center justify-between text-foodly-primary hover:underline"
                  >
                    View All Favorites <ChevronRight className="h-4 w-4 ml-1" />
                  </Button>
                </CardContent>
              </Card>
            </motion.div>

            {/* Addresses Card */}
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.28 }}
            >
              <Card className="rounded-xl shadow-lg border-0 bg-white/95">
                <CardContent className="p-6">
                  <div className="flex items-center gap-3 mb-2">
                    <Home className="h-6 w-6 text-foodly-primary" />
                    <span className="text-lg font-semibold text-foodly-primary">Saved Addresses</span>
                  </div>
                  <div className="space-y-2">
                    <div>
                      <span className="font-medium">Home:</span>
                      <span className="ml-2 text-muted-foreground">123 Main St, Springfield</span>
                    </div>
                    <div>
                      <span className="font-medium">Work:</span>
                      <span className="ml-2 text-muted-foreground">456 Office Park, Springfield</span>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    className="mt-4 w-full flex items-center justify-between text-foodly-primary hover:underline"
                  >
                    Manage Addresses <ChevronRight className="h-4 w-4 ml-1" />
                  </Button>
                </CardContent>
              </Card>
            </motion.div>

            {/* Settings Card */}
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <Card className="rounded-xl shadow-lg border-0 bg-white/95">
                <CardContent className="p-6">
                  <div className="flex items-center gap-3 mb-2">
                    <Settings className="h-6 w-6 text-foodly-primary" />
                    <span className="text-lg font-semibold text-foodly-primary">Settings & Quick Actions</span>
                  </div>
                  <div className="flex flex-wrap gap-4 mt-4">
                    <Button variant="secondary" className="flex-1 min-w-[120px]">
                      Change Password
                    </Button>
                    <Button variant="secondary" className="flex-1 min-w-[120px]">
                      Manage Addresses
                    </Button>
                    <Button variant="secondary" className="flex-1 min-w-[120px]">
                      Payment Methods
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

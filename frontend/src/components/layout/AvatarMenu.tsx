import React from "react";
import { useNavigate } from "react-router-dom";
import { Avatar } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";

export const AvatarMenu: React.FC = () => {
  const navigate = useNavigate();

  return (
    <Button
      variant="ghost"
      className="p-0 rounded-full"
      onClick={() => navigate("/profile")}
      aria-label="Open Profile"
    >
      <Avatar />
    </Button>
  );
};

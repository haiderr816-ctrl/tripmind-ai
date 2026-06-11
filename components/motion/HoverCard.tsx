"use client";

import { motion } from "framer-motion";
import { ReactNode } from "react";
import { Card } from "@/components/ui/card";

interface HoverCardProps {
  children: ReactNode;
  variant?: "default" | "glass" | "elevated";
  className?: string;
}

export function HoverCard({ children, variant = "default", className }: HoverCardProps) {
  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      transition={{ duration: 0.2, ease: "easeOut" }}
    >
      <Card variant={variant} className={className}>
        {children}
      </Card>
    </motion.div>
  );
}

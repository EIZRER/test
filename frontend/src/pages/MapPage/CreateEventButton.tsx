import React from 'react';
import { Button } from "../../components/ui/button";
import { Plus } from "lucide-react";

interface CreateEventButtonProps {
  onClick: () => void;
}

const CreateEventButton: React.FC<CreateEventButtonProps> = ({ onClick }) => {
  return (
    <Button
      onClick={onClick}
      className="fixed top-4 right-4 z-10 bg-blue-500 text-white hover:bg-blue-600 flex items-center gap-2"
    >
      <Plus className="h-4 w-4" />
      Create Event
    </Button>
  );
};

export default CreateEventButton; 
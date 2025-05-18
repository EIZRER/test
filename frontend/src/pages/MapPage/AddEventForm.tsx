import React, { useState, ChangeEvent, FormEvent } from 'react';
import type { Event } from '../EventDetailPage/types';
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Textarea } from "../../components/ui/textarea";
import { Label } from "../../components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { X } from "lucide-react";

interface AddEventFormProps {
  location: google.maps.LatLngLiteral;
  onSave: (event: Omit<Event, '_id'>) => void;
  onCancel: () => void;
}

const AddEventForm: React.FC<AddEventFormProps> = ({ location, onSave, onCancel }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [address, setAddress] = useState('');
  const [category, setCategory] = useState('');
  const [organizer, setOrganizer] = useState('');
  const [imageUrl, setImageUrl] = useState('');

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    onSave({
      title,
      description,
      date,
      time,
      location: {
        address,
        latitude: location.lat,
        longitude: location.lng
      },
      category,
      organizer,
      imageUrl: imageUrl || 'https://via.placeholder.com/300x200'
    });
  };

  return (
    <>
      {/* Blur overlay */}
      <div 
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
        onClick={onCancel}
      />
      
      {/* Form */}
      <Card className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[600px] max-h-[99vh] mb-[40px] z-50">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-xl font-bold">Add New Event</CardTitle>
          <Button onClick={onCancel} className="bg-blue-500 text-white hover:bg-blue-600">
            <X className="h-4 w-4" />
          </Button>
        </CardHeader>
        <CardContent className="pb-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="title">Event Title</Label>
                <Input
                  id="title"
                  placeholder="Enter event title"
                  value={title}
                  onChange={(e: ChangeEvent<HTMLInputElement>) => setTitle(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="category">Category</Label>
                <Input
                  id="category"
                  placeholder="Enter event category"
                  value={category}
                  onChange={(e: ChangeEvent<HTMLInputElement>) => setCategory(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                placeholder="Enter event description"
                value={description}
                onChange={(e: ChangeEvent<HTMLTextAreaElement>) => setDescription(e.target.value)}
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="date">Date</Label>
                <Input
                  id="date"
                  type="date"
                  value={date}
                  onChange={(e: ChangeEvent<HTMLInputElement>) => setDate(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="time">Time</Label>
                <Input
                  id="time"
                  type="time"
                  value={time}
                  onChange={(e: ChangeEvent<HTMLInputElement>) => setTime(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="address">Address</Label>
              <Input
                id="address"
                placeholder="Enter event address"
                value={address}
                onChange={(e: ChangeEvent<HTMLInputElement>) => setAddress(e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="organizer">Organizer</Label>
              <Input
                id="organizer"
                placeholder="Enter organizer name"
                value={organizer}
                onChange={(e: ChangeEvent<HTMLInputElement>) => setOrganizer(e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="imageUrl">Image URL (optional)</Label>
              <Input
                id="imageUrl"
                type="url"
                placeholder="Enter image URL"
                value={imageUrl}
                onChange={(e: ChangeEvent<HTMLInputElement>) => setImageUrl(e.target.value)}
              />
            </div>

            <div className="flex justify-end space-x-2 pt-4 border-t mt-4">
              <Button type="button" onClick={onCancel} className="bg-blue-500 text-white hover:bg-blue-600">
                Cancel
              </Button>
              <Button type="submit" className="bg-blue-500 text-white hover:bg-blue-600">
                Create Event
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </>
  );
};

export default AddEventForm;

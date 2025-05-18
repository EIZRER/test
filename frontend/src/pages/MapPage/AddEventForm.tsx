import React, { useState, ChangeEvent, FormEvent } from 'react';
import type { Event } from '../EventDetailPage/types';
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Textarea } from "../../components/ui/textarea";
import { Label } from "../../components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { X } from "lucide-react";
import { categories } from '../../mock/categories';

interface AddEventFormProps {
  location: google.maps.LatLngLiteral;
  onSave: (event: any) => void;
  onCancel: () => void;
}

const AddEventForm: React.FC<AddEventFormProps> = ({ location, onSave, onCancel }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [category, setCategory] = useState('');
  const [price, setPrice] = useState('0');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [venue, setVenue] = useState('');

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    
    const formData = new FormData();
    formData.append('title', title);
    formData.append('description', description);
    formData.append('date', date);
    formData.append('time', time);
    formData.append('category', category);
    formData.append('price', price);
    formData.append('venue', venue);
    formData.append('location[latitude]', String(location.lat));
    formData.append('location[longitude]', String(location.lng));
    
    if (imageFile) {
      formData.append('image', imageFile);
    }
    
    onSave(formData);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
        <h2 className="text-2xl font-bold mb-4">Add New Event</h2>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block mb-1">Title</label>
            <input
              type="text"
              className="w-full px-3 py-2 border rounded"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>
          
          <div>
            <label className="block mb-1">Description</label>
            <textarea
              className="w-full px-3 py-2 border rounded"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
              rows={3}
            ></textarea>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block mb-1">Date</label>
              <input
                type="date"
                className="w-full px-3 py-2 border rounded"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                required
              />
            </div>
            <div>
              <label className="block mb-1">Time</label>
              <input
                type="time"
                className="w-full px-3 py-2 border rounded"
                value={time}
                onChange={(e) => setTime(e.target.value)}
              />
            </div>
          </div>
          
          <div>
            <label className="block mb-1">Category</label>
            <select
              className="w-full px-3 py-2 border rounded"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              required
            >
              <option value="">Select a category</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.label}>
                  {cat.label}
                </option>
              ))}
            </select>
          </div>
          
          <div>
            <label className="block mb-1">Venue</label>
            <input
              type="text"
              className="w-full px-3 py-2 border rounded"
              value={venue}
              onChange={(e) => setVenue(e.target.value)}
            />
          </div>
          
          <div>
            <label className="block mb-1">Price</label>
            <input
              type="number"
              className="w-full px-3 py-2 border rounded"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              min="0"
              required
            />
          </div>
          
          <div>
            <label className="block mb-1">Image</label>
            <input
              type="file"
              className="w-full px-3 py-2 border rounded"
              onChange={(e) => e.target.files && setImageFile(e.target.files[0])}
              accept="image/*"
              required
            />
          </div>
          
          <div className="flex space-x-4">
            <button
              type="button"
              className="flex-1 px-4 py-2 bg-gray-200 rounded"
              onClick={onCancel}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-2 bg-blue-500 text-white rounded"
            >
              Save Event
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddEventForm;

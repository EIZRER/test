export type Event = {
  _id: string;
  title: string;
  description: string;
  date: string;
  time: string;
  location: {
    address: string;
    latitude: number;
    longitude: number;
  };
  imageUrl: string;
  category: string;
  organizer: string;
};

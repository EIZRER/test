export type Event = {
  _id: string;
  title: string;
  description: string;
  date: string;
  time: string;
  location: {
    address: string;
  };
  imageUrl: string;
  category: string;
  organizer: string;
};

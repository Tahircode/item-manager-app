import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import 'react-responsive-carousel/lib/styles/carousel.min.css';
import { Carousel } from 'react-responsive-carousel';

interface Item {
  id: string;
  name: string;
  type: string;
  description: string;
  coverImageUrl: string;
  additionalImages: string[];
}

const ViewItems = () => {
  const [items, setItems] = useState<Item[]>([]);
  const [selectedItem, setSelectedItem] = useState<Item | null>(null);
  const [enquireSent, setEnquireSent] = useState(false);
  const [loading, setLoading] = useState(true);

  // useEffect(() => {
  //   fetch('http://localhost:4000/items')
  //     .then(res => res.json())
  //     .then(data => {
  //       console.log('Fetched items:', data); // Add this
  //       setItems(data);
  //       setLoading(false);
  //     })
  //     .catch(() => {
  //       console.error('Failed to fetch items');
  //       setItems([]);
  //       setLoading(false);
  //     });
  // }, []);
  useEffect(() => {
    const cachedItems = localStorage.getItem('items-cache');
  
    if (cachedItems) {
      setItems(JSON.parse(cachedItems));
      setLoading(false); // ✅ avoid showing the loading spinner
    } else {
      fetch(`${import.meta.env.BACKEND_URL}/items`)
        .then(res => res.json())
        .then(data => {
          setItems(data);
          localStorage.setItem('items-cache', JSON.stringify(data)); // ✅ cache it
          setLoading(false);
        })
        .catch(() => {
          console.error('Failed to fetch items');
          setItems([]);
          setLoading(false);
        });
    }
  }, []);


  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setSelectedItem(null);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleEnquire = async () => {
    if (!selectedItem) return;
    try {
      await fetch(`${import.meta.env.BACKEND_URL}/enquire`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ itemId: selectedItem.id, itemName: selectedItem.name })
      });
      setEnquireSent(true);
      setTimeout(() => setEnquireSent(false), 3000);
    } catch {
      alert('Failed to send enquiry');
    }
  };


  return (
    <div className="p-4 max-w-6xl mx-auto">
      <h1 className="text-2xl font-bold mb-6 text-center">View Items</h1>

      {loading ? (
        <div className="text-center text-gray-500 p-10">Loading items...</div>
      ) : items.length === 0 ? (
        <div className="text-center text-gray-600 bg-yellow-50 border border-yellow-200 rounded p-6">
          No items found. Please add some items.
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {items.map(item => (
            <motion.div
              key={item.id}
              className="border rounded shadow cursor-pointer overflow-hidden"
              whileHover={{ scale: 1.05 }}
              onClick={() => setSelectedItem(item)}
            >
              <img
                src={item.coverImageUrl}
                alt={item.name}
                className="h-48 w-full object-contain"
              />

              <div className="p-2">
                <h2 className="text-lg font-semibold text-center">{item.name}</h2>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      <AnimatePresence>
        {selectedItem && (
          <motion.div
            className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="bg-white p-6 rounded-lg max-w-2xl w-full relative"
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
            >
              <button
                className="absolute top-2 right-2 text-gray-700 text-xl"
                onClick={() => setSelectedItem(null)}
              >
                &times;
              </button>
              <Carousel showThumbs={true} infiniteLoop useKeyboardArrows dynamicHeight={false}>
                <div className="flex items-center justify-center bg-gray-50 h-[400px]">
                  <img
                    src={selectedItem.coverImageUrl}
                    alt="cover"
                    className="object-contain max-h-full max-w-full"
                  />
                </div>
                {selectedItem.additionalImages.map((src, i) => (
                  <div key={i} className="flex items-center justify-center bg-gray-50 h-[400px]">
                    <img
                      src={src}
                      alt={`image-${i}`}
                      className="object-contain max-h-full max-w-full"
                    />
                  </div>
                ))}
              </Carousel>

              <div className="mt-4 text-center">
                <h2 className="text-xl font-bold">{selectedItem.name}</h2>
                <p className="text-gray-600 italic">{selectedItem.type}</p>
                <p className="mt-2 text-sm text-gray-700">{selectedItem.description}</p>
              </div>
              <div className="mt-4 text-center">
                <button
                  onClick={handleEnquire}
                  disabled={enquireSent}
                  className={`px-4 py-2 rounded ${enquireSent ? 'bg-green-500' : 'bg-blue-600 hover:bg-blue-700'} text-white`}
                >
                  {enquireSent ? 'Enquiry Sent' : 'Enquire'}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ViewItems;

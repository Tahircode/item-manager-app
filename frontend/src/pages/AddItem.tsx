import React, { useState } from 'react';

const itemTypes = ['Shirt', 'Pant', 'Shoes', 'Sports Gear','Accessory', 'Others'];

const AddItem = () => {
  const [formData, setFormData] = useState({
    name: '',
    type: '',
    description: '',
    coverImage: null as File | null,
    additionalImages: [] as File[]
  });

  const [coverPreview, setCoverPreview] = useState<string | null>(null);
  const [additionalPreviews, setAdditionalPreviews] = useState<string[]>([]);
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleCoverImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setFormData(prev => ({ ...prev, coverImage: file }));
    setCoverPreview(URL.createObjectURL(file));
  };

  const handleAdditionalImagesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? []);
    setFormData(prev => ({ ...prev, additionalImages: [...prev.additionalImages, ...files] }));
    setAdditionalPreviews(prev => [...prev, ...files.map(file => URL.createObjectURL(file))]);
  };

  const handleRemoveImage = (index: number) => {
    setAdditionalPreviews(prev => prev.filter((_, i) => i !== index));
    setFormData(prev => ({
      ...prev,
      additionalImages: prev.additionalImages.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const data = new FormData();
    data.append('name', formData.name);
    data.append('type', formData.type);
    data.append('description', formData.description);
    if (formData.coverImage) data.append('coverImage', formData.coverImage);
    formData.additionalImages.forEach(img => data.append('additionalImages', img));

    try {
      const res = await fetch(`${import.meta.env.BACKEND_URL}/items`, {
        method: 'POST',
        body: data
      });

      if (!res.ok) throw new Error('Failed to add item');

      setSuccess(true);
      setFormData({ name: '', type: '', description: '', coverImage: null, additionalImages: [] });
      setCoverPreview(null);
      setAdditionalPreviews([]);
      localStorage.removeItem('items-cache');
      setTimeout(() => setSuccess(false), 2000);
    } catch (err) {
      alert('Something went wrong while adding the item');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white- flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-lg p-6 max-w-2xl w-full">
        <h2 className="text-2xl font-bold mb-4 text-center">Add New Item</h2>
        {success && <div className="bg-green-500 text-white p-2 rounded mb-4 text-center">Item added successfully!</div>}
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            name="name"
            placeholder="Item Name"
            value={formData.name}
            onChange={handleInputChange}
            required
            className="w-full p-2 border rounded"
          />
          <select
            name="type"
            value={formData.type}
            onChange={handleInputChange}
            required
            className="w-full p-2 border rounded"
          >
            <option value="">Select Item Type</option>
            {itemTypes.map((type) => (
              <option key={type} value={type}>{type}</option>
            ))}
          </select>
          <textarea
            name="description"
            placeholder="Description"
            value={formData.description}
            onChange={handleInputChange}
            required
            className="w-full p-2 border rounded"
          />

          <div
            className="border-2 border-dashed border-gray-400 h-32 flex items-center justify-center rounded cursor-pointer relative"
            onClick={() => document.getElementById('coverUpload')?.click()}
          >
            {!coverPreview ? (
              <>
                <span className="text-gray-400 text-4xl font-bold">+</span>
                <div className="absolute bottom-2 text-sm text-gray-500">Cover Image</div>
              </>
            ) : (
              <img src={coverPreview} alt="Cover Preview" className="h-full w-full object-contain rounded" />
            )}
            <input
              type="file"
              id="coverUpload"
              accept="image/*"
              onChange={handleCoverImageChange}
              className="hidden"
            />
          </div>



          <input
            type="file"
            accept="image/*"
            multiple
            onChange={handleAdditionalImagesChange}
            className="w-full"
          />

          {additionalPreviews.length > 0 && (
            <div className="flex flex-wrap gap-3 mt-2">
              {additionalPreviews.map((src, index) => (
                <div key={index} className="relative">
                  <img src={src} alt={`Preview ${index}`} className="h-20 w-20 rounded object-cover" />
                  <button
                    type="button"
                    onClick={() => handleRemoveImage(index)}
                    className="absolute -top-2 -right-2 bg-red-600 text-white rounded-full h-6 w-6 flex items-center justify-center"
                  >
                    &times;
                  </button>
                </div>
              ))}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className={`bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 flex items-center justify-center gap-2 w-full ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
          >
            {loading ? (
              <>
                <svg className="animate-spin h-5 w-5 text-white" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="white" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
                </svg>
                Uploading...
              </>
            ) : (
              'Add Item'
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddItem;

import React from 'react';

const FoodForm = ({ visible, analyzing, formData, setFormData, onSubmit, onCancel }) => {
  if (!visible) return null;

  return (
    <div className="absolute inset-0 bg-black/50 z-[9999] flex items-center justify-center p-4">
      <div className="bg-white p-6 rounded-lg w-full max-w-md shadow-2xl">
        <h2 className="text-xl font-bold mb-4">List New Food</h2>
        
        {analyzing ? (
          <div className="text-center py-10 animate-pulse text-green-600 font-bold">
            🤖 AI is analyzing your food photo...
            <p className="text-sm text-gray-500 font-normal mt-2">identifying donuts, pizza, veggies...</p>
          </div>
        ) : (
          <form onSubmit={onSubmit} className="space-y-3">
            <div>
                <label className="text-xs font-bold text-gray-500">Title</label>
                <input 
                  className="w-full border p-2 rounded" 
                  // ⚠️ FIX: Added || '' to prevent "uncontrolled input" error
                  value={formData.title || ''} 
                  onChange={e => setFormData({...formData, title: e.target.value})} 
                  required
                />
            </div>
            
            <div>
                <label className="text-xs font-bold text-gray-500">Description</label>
                <textarea 
                  className="w-full border p-2 rounded h-24" 
                  // ⚠️ FIX: Added || ''
                  value={formData.description || ''} 
                  onChange={e => setFormData({...formData, description: e.target.value})} 
                  required
                />
            </div>

            <div>
                <label className="text-xs font-bold text-gray-500">Rescue Price ($)</label>
                <input 
                  type="number" 
                  className="w-full border p-2 rounded" 
                  // ⚠️ FIX: Added || ''
                  value={formData.price || ''} 
                  onChange={e => setFormData({...formData, price: e.target.value})} 
                  required
                />
            </div>
            
            <div className="flex gap-2 mt-4">
              <button type="button" onClick={onCancel} className="flex-1 bg-gray-300 py-2 rounded">Cancel</button>
              <button type="submit" className="flex-1 bg-green-600 text-white py-2 rounded font-bold">Post Listing</button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default FoodForm;
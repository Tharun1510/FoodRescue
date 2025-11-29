import React from 'react';

const ClaimModal = ({ isOpen, onClose, onConfirm, title, loading, successData }) => {
  if (!isOpen) return null;

  // Helper to safely render the recipe
  const renderRecipe = () => {
    if (!successData?.recipe) return null;
    
    let recipe = successData.recipe;
    
    // Safety check: If for some reason it's still a string, try to parse it
    if (typeof recipe === 'string') {
      try {
        recipe = JSON.parse(recipe);
      } catch (e) {
        // If it's just a plain text string, return it as a paragraph
        return <p className="text-sm text-gray-700 italic">"{recipe}"</p>;
      }
    }

    // ⚠️ THIS WAS THE FIX:
    // We check if it's an object. If so, we map through the steps.
    // We DO NOT try to render the whole object directly.
    return (
      <div className="text-left bg-orange-50 p-4 rounded-lg border border-orange-100 mt-4">
        <div className="flex items-center gap-2 mb-2">
           <span className="text-xl">👨‍🍳</span>
           {/* Render the Name */}
           <h3 className="font-bold text-orange-800">{recipe.name || "Chef's Suggestion"}</h3>
        </div>
        
        {/* Render the Steps Loop */}
        <div className="space-y-2">
          {recipe.steps && Array.isArray(recipe.steps) ? (
             recipe.steps.map((step, index) => (
              <div key={index} className="flex gap-2 text-sm text-gray-700">
                <span className="font-bold text-orange-400">{index + 1}.</span>
                <span>{step}</span>
              </div>
            ))
          ) : (
            // Fallback if steps aren't an array
            <p className="text-sm text-gray-700">{JSON.stringify(recipe)}</p>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="absolute inset-0 z-[9999] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm overflow-hidden transform transition-all scale-100">
        
        {successData ? (
          <div className="text-center">
            <div className="bg-green-600 p-6 text-white">
              <div className="text-4xl mb-2">🎉</div>
              <h2 className="text-2xl font-black uppercase tracking-wide">Claimed!</h2>
              <p className="opacity-90 text-sm">Head to the store to pick it up.</p>
            </div>
            
            <div className="p-6">
              <div className="bg-gray-100 border-2 border-dashed border-gray-300 rounded-lg p-4">
                <p className="text-xs text-gray-500 uppercase font-bold">Your Pickup Code</p>
                <p className="text-4xl font-mono font-black text-gray-800 tracking-widest">{successData.pickupCode}</p>
              </div>

              {/* RENDER THE RECIPE HERE */}
              {renderRecipe()}

              <button 
                onClick={onClose}
                className="mt-6 w-full bg-gray-900 text-white py-3 rounded-xl font-bold hover:bg-black transition"
              >
                Done
              </button>
            </div>
          </div>
        ) : (
          <div className="p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-2">Claim this food?</h2>
            <p className="text-gray-500 mb-6">
              You are claiming <span className="font-bold text-green-700">"{title}"</span>. 
              This will remove it from the map for others.
            </p>

            {loading ? (
              <button disabled className="w-full bg-green-100 text-green-700 py-3 rounded-xl font-bold flex items-center justify-center gap-2">
                <div className="w-5 h-5 border-2 border-green-700 border-t-transparent rounded-full animate-spin"></div>
                Generating Recipe...
              </button>
            ) : (
              <div className="flex gap-3">
                <button 
                  onClick={onClose}
                  className="flex-1 bg-gray-100 text-gray-700 py-3 rounded-xl font-bold hover:bg-gray-200 transition"
                >
                  Cancel
                </button>
                <button 
                  onClick={onConfirm}
                  className="flex-1 bg-green-600 text-white py-3 rounded-xl font-bold shadow-lg shadow-green-200 hover:bg-green-700 transition"
                >
                  Yes, Claim it!
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ClaimModal;
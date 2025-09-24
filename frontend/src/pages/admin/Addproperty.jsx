import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useProperties } from "../../context/PropertyContext";


export default function AddProperty() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { addProperty } = useProperties();

  const [form, setForm] = useState({
    title: "",
    location: "",
    price: "",
    type: "Apartment",
    bedrooms: 1,
    bathrooms: 1,
    areaSqft: 600,
    areaUnit: "sqft",
    image: "",
    gallery: ["", "", "", "", ""],
    desc: ""
  });

  const [uploadMode, setUploadMode] = useState({ cover: 'url', gallery: ['url', 'url', 'url', 'url', 'url'] });
  const [loading, setLoading] = useState(false);

  const handleGalleryChange = (index, value) => {
    const updatedGallery = [...form.gallery];
    updatedGallery[index] = value;
    setForm({ ...form, gallery: updatedGallery });
  };

  const handleFileUpload = (file, type, index = null) => {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      const dataURL = e.target.result;
      if (type === 'cover') {
        setForm({ ...form, image: dataURL });
      } else if (type === 'gallery' && index !== null) {
        const updatedGallery = [...form.gallery];
        updatedGallery[index] = dataURL;
        setForm({ ...form, gallery: updatedGallery });
      }
    };
    reader.readAsDataURL(file);
  };

  const toggleUploadMode = (type, index = null) => {
    if (type === 'cover') {
      setUploadMode({ ...uploadMode, cover: uploadMode.cover === 'url' ? 'file' : 'url' });
      setForm({ ...form, image: '' });
    } else if (type === 'gallery' && index !== null) {
      const newModes = [...uploadMode.gallery];
      newModes[index] = newModes[index] === 'url' ? 'file' : 'url';
      setUploadMode({ ...uploadMode, gallery: newModes });
      handleGalleryChange(index, '');
    }
  };

  // Helper function to convert area to square feet
  const convertToSqFt = (area, unit) => {
    switch (unit) {
      case 'sqft':
        return area;
      case 'sqyd':
        return area * 9; // 1 square yard = 9 square feet
      case 'gaj':
        return area * 9; // 1 gaj = 9 square feet
      default:
        return area;
    }
  };

  const submit = async (e) => {
    e.preventDefault();

    if (!user?.token) {
      alert("You must be logged in to add a property!");
      return;
    }

    setLoading(true); // start loading

    try {
      // Convert area to square feet before sending
      const formToSend = {
        ...form,
        areaSqft: convertToSqFt(form.areaSqft, form.areaUnit)
        // Don't send areaUnit since backend doesn't expect it
      };
      delete formToSend.areaUnit;

      const res = await fetch("http://zipacres.onrender.com/api/properties", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${user?.token || ""}`
        },
        credentials: 'include',
        body: JSON.stringify(formToSend),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Failed to add property");
      }

      addProperty(data.property);

      alert("Property added successfully!");
      navigate(-1);
    } catch (err) {
      console.error(err);
      alert("Failed to add property: " + err.message);
    } finally {
      setLoading(false); // stop loading
    }
  };

  const inputClass = "w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-blue-500 focus:outline-none transition-colors bg-white";
  const labelClass = "block text-sm font-semibold text-gray-700 mb-2";

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 p-4 lg:p-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-3xl shadow-2xl p-8 space-y-8 border border-gray-100">
          <div className="bg-gradient-to-r from-blue-900 to-blue-950 px-8 py-6 rounded-2xl shadow-xl relative overflow-hidden">
            <div className="absolute inset-0 bg-black opacity-10"></div>
            <div className="relative z-10">
              <h1 className="text-3xl font-semibold tracking-tight text-white">Add New Property</h1>
              <p className="text-blue-100 text-sm tracking-tight mt-2">List your property with professional details</p>
            </div>
            <div className="absolute top-0 right-0 w-32 h-32 bg-white opacity-10 rounded-full -translate-y-16 translate-x-16"></div>
          </div>

          <form onSubmit={submit} className="space-y-8">
            {/* Basic Info */}
            <div className="bg-gray-50 rounded-2xl p-6 border border-gray-100">
              <h2 className="text-xl font-semibold text-gray-800 mb-6 flex items-center">
                <div className="w-2 h-6 bg-blue-900 rounded-full mr-3"></div>
                Basic Information
              </h2>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-3">Property Title</label>
                  <input type="text" required placeholder="Enter property title" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:ring-1 focus:ring-blue-900 focus:border-transparent transition-all duration-200 text-gray-700 placeholder-gray-400 shadow-sm hover:shadow-md" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-3">Location</label>
                  <input type="text" required placeholder="City, Area" value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:ring-1 focus:ring-blue-900 focus:border-transparent transition-all duration-200 text-gray-700 placeholder-gray-400 shadow-sm hover:shadow-md" />
                </div>
              </div>
            </div>

            <div className="bg-gray-50 rounded-2xl p-6 border border-gray-100">
              <h2 className="text-xl font-semibold text-gray-800 mb-6 flex items-center">
                <div className="w-2 h-6 bg-emerald-800 rounded-full mr-3"></div>
                Property Details
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-3">Price</label>
                  <input type="text" required placeholder="₹1,50,00,000" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:ring-1 focus:ring-blue-900 focus:border-transparent transition-all duration-200 text-gray-700 placeholder-gray-400 shadow-sm hover:shadow-md" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-3">Type</label>
                  <select value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })} className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:ring-1 focus:ring-blue-900 focus:border-transparent transition-all duration-200 text-gray-700 placeholder-gray-400 shadow-sm hover:shadow-md">
                    <option>Apartment</option>
                    <option>Plot</option>
                    <option>Villa</option>
                    <option>Penthouse</option>
                    <option>Studio</option>
                    <option>Independent House</option>
                    <option>Farmhouse</option>
                    <option>Duplex</option>
                    <option>Builder Floor</option>
                  </select>
                </div>
                {form.type !== "Plot" ? (
                  <>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-3">Bedrooms</label>
                      <input type="number" min="0" value={form.bedrooms} onChange={(e) => setForm({ ...form, bedrooms: Number(e.target.value) })} className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:ring-1 focus:ring-blue-900 focus:border-transparent transition-all duration-200 text-gray-700 placeholder-gray-400 shadow-sm hover:shadow-md" />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-3">Bathrooms</label>
                      <input type="number" min="0" value={form.bathrooms} onChange={(e) => setForm({ ...form, bathrooms: Number(e.target.value) })} className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:ring-1 focus:ring-blue-900 focus:border-transparent transition-all duration-200 text-gray-700 placeholder-gray-400 shadow-sm hover:shadow-md" />
                    </div>
                  </>
                ) : (
                  <>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-3">Area</label>
                      <input type="number" min="0" value={form.areaSqft} onChange={(e) => setForm({ ...form, areaSqft: Number(e.target.value) })} className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-gray-700 placeholder-gray-400 shadow-sm hover:shadow-md" />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-3">Area Unit</label>
                      <select value={form.areaUnit} onChange={(e) => setForm({ ...form, areaUnit: e.target.value })} className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:ring-1 focus:ring-blue-900 focus:border-transparent transition-all duration-200 text-gray-700 placeholder-gray-400 shadow-sm hover:shadow-md">
                        <option value="sqft">Square Feet</option>
                        <option value="sqyd">Square Yard</option>
                        <option value="gaj">Gaj</option>
                      </select>
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* Images */}
            <div className="bg-gray-50 rounded-2xl p-6 border border-gray-100 shadow-sm">
              <h3 className="text-xl font-semibold text-gray-800 mb-6 flex items-center">
                <div className="w-2 h-6 bg-purple-800 rounded-full mr-3"></div>
                Property Images
              </h3>

              {/* Cover Image */}
              <div className="mb-8">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Cover Image
                </label>

                <div className="bg-white rounded-xl p-4 border border-gray-200 shadow-sm space-y-4">
                  {/* Input + Toggle on one line for larger screens */}
                  <div className="flex flex-col md:flex-row md:items-center md:space-x-3 space-y-3 md:space-y-0">
                    {uploadMode.cover === 'url' ? (
                      <input
                        type="text"
                        placeholder="Enter image URL"
                        value={form.image}
                        onChange={(e) => setForm({ ...form, image: e.target.value })}
                        className="flex-1 px-4 py-2.5 bg-white border border-gray-200 rounded-lg 
                     focus:ring-2 focus:ring-purple-600 focus:border-transparent 
                     transition-all text-gray-700 placeholder-gray-400 shadow-sm hover:shadow-md"
                      />
                    ) : (
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleFileUpload(e.target.files[0], 'cover')}
                        className="flex-1 px-4 py-2.5 bg-white border border-gray-200 rounded-lg 
                     focus:ring-2 focus:ring-purple-600 focus:border-transparent 
                     transition-all text-gray-700 placeholder-gray-400 shadow-sm hover:shadow-md"
                      />
                    )}

                    <button
                      type="button"
                      onClick={() => toggleUploadMode('cover')}
                      className="px-5 py-2 bg-gradient-to-r from-purple-600 to-purple-700 
                   text-white rounded-lg hover:from-purple-700 hover:to-purple-800 
                   transition-all font-medium text-sm shadow-sm whitespace-nowrap"
                    >
                      {uploadMode.cover === 'url' ? 'Use File' : 'Use URL'}
                    </button>
                  </div>

                  {/* Preview */}
                  {form.image && (
                    <div className="relative inline-block">
                      <img
                        src={form.image}
                        alt="Cover"
                        className="h-40 w-64 object-cover rounded-lg shadow-md"
                      />
                      <button
                        type="button"
                        onClick={() => setForm({ ...form, image: '' })}
                        title="Remove image"
                        className="absolute -top-2 -right-2 flex items-center justify-center 
                     w-7 h-7 rounded-full bg-red-500 text-white 
                     hover:bg-red-600 shadow-md hover:shadow-lg 
                     transition-all duration-300"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          strokeWidth={2}
                          stroke="currentColor"
                          className="w-3.5 h-3.5"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {/* Gallery Images */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-3">
                  Gallery
                </label>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                  {form.gallery.map((img, i) => (
                    <div
                      key={i}
                      className="relative bg-white rounded-xl p-4 border border-gray-200 shadow-sm space-y-3"
                    >
                      <div className="text-sm font-medium text-gray-600">Image {i + 1}</div>

                      {uploadMode.gallery[i] === 'url' ? (
                        <input
                          type="text"
                          placeholder={`Image ${i + 1} URL`}
                          value={img}
                          onChange={(e) => handleGalleryChange(i, e.target.value)}
                          className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg 
                         focus:ring-2 focus:ring-purple-600 focus:border-transparent 
                         transition-all duration-200 text-gray-700 placeholder-gray-400 text-sm shadow-sm hover:shadow-md"
                        />
                      ) : (
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => handleFileUpload(e.target.files[0], 'gallery', i)}
                          className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg 
                         focus:ring-2 focus:ring-purple-600 focus:border-transparent 
                         transition-all duration-200 text-gray-700 placeholder-gray-400 text-sm shadow-sm hover:shadow-md"
                        />
                      )}

                      <button
                        type="button"
                        onClick={() => toggleUploadMode('gallery', i)}
                        className="w-full px-3 py-2 bg-gradient-to-r from-purple-600 to-purple-700 
                       text-white rounded-lg hover:from-purple-700 hover:to-purple-800 
                       transition-all font-medium text-xs shadow-sm"
                      >
                        {uploadMode.gallery[i] === 'url' ? 'File' : 'URL'}
                      </button>

                      {img && (
                        <div className="relative">
                          <img
                            src={img}
                            alt={`Gallery ${i + 1}`}
                            className="h-28 w-full object-cover rounded-lg shadow-md"
                          />
                          <button
                            type="button"
                            onClick={() => {
                              const newGallery = [...form.gallery];
                              newGallery[i] = '';
                              setForm({ ...form, gallery: newGallery });
                            }}
                            title="Remove image"
                            className="absolute -top-2 -right-2 flex items-center justify-center 
                           w-6 h-6 rounded-full bg-red-500 text-white 
                           hover:bg-red-600 shadow-md hover:shadow-lg 
                           transition-all duration-300"
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              fill="none"
                              viewBox="0 0 24 24"
                              strokeWidth={2}
                              stroke="currentColor"
                              className="w-3 h-3"
                            >
                              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                            </svg>
                          </button>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Description */}
            <div className="bg-gray-50 rounded-2xl p-6 border border-gray-100">
              <h2 className="text-xl font-semibold text-gray-800 mb-6 flex items-center">
                <div className="w-2 h-6 bg-orange-800 rounded-full mr-3"></div>
                Property Description
              </h2>
              <textarea rows="5" placeholder="Describe your property features, amenities, and highlights..." value={form.desc} onChange={(e) => setForm({ ...form, desc: e.target.value })} className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:ring-1 focus:ring-blue-900 focus:border-transparent transition-all duration-200 text-gray-700 placeholder-gray-400 shadow-sm hover:shadow-md resize-none" />
            </div>

            {/* Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-end pt-6 border-t border-gray-200">
              <button type="button" onClick={() => navigate(-1)} className="px-8 py-3 rounded-xl bg-gray-100 text-gray-700 hover:bg-gray-200 transition-all duration-200 font-semibold border border-gray-200 hover:shadow-md">Cancel</button>
              <button
                type="submit"
                disabled={loading} 
                className={`px-8 py-3 rounded-xl bg-gradient-to-r from-blue-950 to-blue-950 
              text-white hover:from-blue-900 hover:to-blue-900 transition-all 
              duration-200 font-semibold shadow-lg hover:shadow-xl transform 
              hover:-translate-y-0.5 
              ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                {loading ? 'Submitting...' : 'Submit'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
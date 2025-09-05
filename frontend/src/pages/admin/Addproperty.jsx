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
    gallery: ["", "", ""],
    desc: ""
  });

  const [uploadMode, setUploadMode] = useState({ cover: 'url', gallery: ['url', 'url', 'url'] });

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

const submit = async (e) => {
  e.preventDefault();

  if (!user?.token) {
    alert("You must be logged in to add a property!");
    return;
  }

  try {
    const res = await fetch("https://zipacres.onrender.com/api/properties", {
      method: "POST",
      headers: { 
        "Content-Type": "application/json",
        "Authorization": `Bearer ${user.token}`
      },
      body: JSON.stringify(form),
    });

    const data = await res.json();

    if (!data.success) throw new Error(data.message);

    // ✅ Add property to context so dashboard updates immediately
    addProperty(data.property);

    alert("Property added successfully!");
    navigate(-1); // back to dashboard
  } catch (err) {
    console.error(err);
    alert("Failed to add property: " + err.message);
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
                    <option>Villa</option>
                    <option>Penthouse</option>
                    <option>Studio</option>
                    <option>Independent House</option>
                    <option>Farmhouse</option>
                    <option>Duplex</option>
                    <option>Builder Floor</option>
                    <option>Land/Plot</option>
                  </select>
                </div>
                {form.type !== "Land/Plot" ? (
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
                        <option value="gaj">Gaj</option>
                      </select>
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* Images */}
            <div className="bg-gray-50 rounded-2xl p-6 border border-gray-100">
              <h3 className="text-xl font-semibold text-gray-800 mb-6 flex items-center">
                <div className="w-2 h-6 bg-purple-800 rounded-full mr-3"></div>
                Property Images
              </h3>
              
              {/* Cover Image */}
              <div className="mb-6">
                <label className="block text-sm font-semibold text-gray-700 mb-3">Cover Image</label>
                <div className="bg-white rounded-xl p-4 border border-gray-200">
                  {uploadMode.cover === 'url' ? (
                    <input type="text" placeholder="Enter image URL" value={form.image} onChange={(e) => setForm({ ...form, image: e.target.value })} className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:ring-1 focus:ring-blue-900 focus:border-transparent transition-all duration-200 text-gray-700 placeholder-gray-400 shadow-sm hover:shadow-md" />
                  ) : (
                    <input type="file" accept="image/*" onChange={(e) => handleFileUpload(e.target.files[0], 'cover')} className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:ring-1 focus:ring-blue-900 focus:border-transparent transition-all duration-200 text-gray-700 placeholder-gray-400 shadow-sm hover:shadow-md" />
                  )}
                  <button type="button" onClick={() => toggleUploadMode('cover')} className="mt-3 px-4 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors font-medium text-sm">{uploadMode.cover === 'url' ? 'Use File' : 'Use URL'}</button>
                  {form.image && <img src={form.image} alt="Cover" className="mt-4 h-32 w-48 object-cover rounded-xl shadow-md" />}
                </div>
              </div>

              {/* Gallery Images */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-3">Gallery</label>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {form.gallery.map((img, i) => (
                    <div key={i} className="bg-white rounded-xl p-4 border border-gray-200 space-y-3">
                      <div className="text-sm font-medium text-gray-600">Image {i+1}</div>
                      {uploadMode.gallery[i] === 'url' ? (
                        <input type="text" placeholder={`Image ${i+1} URL`} value={img} onChange={(e) => handleGalleryChange(i, e.target.value)} className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg focus:ring-1 focus:ring-blue-900 focus:border-transparent transition-all duration-200 text-gray-700 placeholder-gray-400 text-sm" />
                      ) : (
                        <input type="file" accept="image/*" onChange={(e) => handleFileUpload(e.target.files[0], 'gallery', i)} className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg focus:ring-1 focus:ring-blue-900 focus:border-transparent transition-all duration-200 text-gray-700 placeholder-gray-400 text-sm" />
                      )}
                      <button type="button" onClick={() => toggleUploadMode('gallery', i)} className="w-full px-3 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors font-medium text-xs">{uploadMode.gallery[i] === 'url' ? 'File' : 'URL'}</button>
                      {img && <img src={img} alt={`Gallery ${i+1}`} className="h-24 w-full object-cover rounded-lg shadow-sm" />}
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
              <button type="submit" className="px-8 py-3 rounded-xl bg-gradient-to-r from-blue-950 to-blue-950 text-white hover:from-blue-900 hover:to-blue-900 transition-all duration-200 font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-0.5">Submit</button>
            </div>

          </form>
        </div>
      </div>
    </div>
  );
}

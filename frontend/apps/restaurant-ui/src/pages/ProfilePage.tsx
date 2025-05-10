import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useRestaurantStore } from '../store/restaurantStore';
import { 
  MapPin, 
  Phone, 
  Mail, 
  Clock, 
  Image, 
  Camera, 
  Info, 
  Tag,
  Edit,
  Save
} from 'lucide-react';

const ProfilePage: React.FC = () => {
  const { profile, loading, error, updateProfile } = useRestaurantStore();
  
  const [isEditing, setIsEditing] = useState(false);
  const [editedProfile, setEditedProfile] = useState(profile);
  
  // Update local state when profile changes
  useEffect(() => {
    if (profile) {
      setEditedProfile(profile);
    }
  }, [profile]);
  
  // Handle form input changes
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    if (!editedProfile) return;
    
    const { name, value } = e.target;
    setEditedProfile({
      ...editedProfile,
      [name]: value
    });
  };
  
  // Handle cuisine tags changes
  const handleCuisineChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!editedProfile) return;
    
    const cuisines = e.target.value.split(',').map(c => c.trim());
    setEditedProfile({
      ...editedProfile,
      cuisine: cuisines
    });
  };
  
  // Handle opening hours changes
  const handleHoursChange = (
    index: number,
    field: 'open' | 'close' | 'isClosed',
    value: string | boolean
  ) => {
    if (!editedProfile) return;
    
    const updatedHours = [...editedProfile.openingHours];
    
    if (field === 'isClosed') {
      updatedHours[index] = {
        ...updatedHours[index],
        isClosed: value as boolean
      };
    } else {
      updatedHours[index] = {
        ...updatedHours[index],
        [field]: value
      };
    }
    
    setEditedProfile({
      ...editedProfile,
      openingHours: updatedHours
    });
  };
  
  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!editedProfile) return;
    
    try {
      await updateProfile(editedProfile);
      setIsEditing(false);
    } catch (err) {
      console.error('Failed to update profile:', err);
    }
  };
  
  // Toggle edit mode
  const toggleEditMode = () => {
    if (isEditing) {
      // Revert changes if cancelling
      setEditedProfile(profile);
    }
    setIsEditing(!isEditing);
  };
  
  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };
  
  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.4 }
    }
  };
  
  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex justify-center">
        <div className="w-12 h-12 border-4 border-primary-200 border-t-primary-500 rounded-full animate-spin"></div>
      </div>
    );
  }
  
  if (error || !profile) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-red-50 rounded-lg p-4 text-red-800">
          <h2 className="text-lg font-medium">Error loading profile</h2>
          <p>{error || 'Profile not found'}</p>
        </div>
      </div>
    );
  }
  
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="space-y-8"
      >
        {/* Header section */}
        <motion.div variants={itemVariants} className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Restaurant Profile
            </h1>
            <p className="text-gray-600">
              Manage your restaurant's information and appearance.
            </p>
          </div>
          
          <motion.button
            className={`btn ${
              isEditing 
                ? 'bg-green-100 hover:bg-green-200 text-green-700 border-none' 
                : 'btn-primary'
            }`}
            onClick={isEditing ? handleSubmit : toggleEditMode}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            {isEditing ? (
              <>
                <Save size={16} className="mr-2" />
                Save Changes
              </>
            ) : (
              <>
                <Edit size={16} className="mr-2" />
                Edit Profile
              </>
            )}
          </motion.button>
        </motion.div>
        
        {/* Banner and logo */}
        <motion.div variants={itemVariants} className="relative">
          <div className="h-48 sm:h-64 rounded-xl overflow-hidden bg-gray-200">
            {isEditing ? (
              <div className="absolute inset-0 flex items-center justify-center">
                <input
                  type="text"
                  name="banner"
                  className="w-full max-w-lg px-4 py-2 bg-white/80 backdrop-blur-sm rounded-lg border border-gray-300"
                  placeholder="Banner image URL"
                  value={editedProfile.banner}
                  onChange={handleChange}
                />
              </div>
            ) : (
              <img
                src={profile.banner}
                alt={`${profile.name} banner`}
                className="w-full h-full object-cover"
              />
            )}
          </div>
          
          <div className="absolute bottom-0 left-8 transform translate-y-1/2">
            <div className="h-24 w-24 rounded-full border-4 border-white bg-white overflow-hidden">
              {isEditing ? (
                <div className="absolute inset-0 flex items-center justify-center bg-gray-200">
                  <Camera size={24} className="text-gray-500" />
                  <input
                    type="text"
                    name="image"
                    className="opacity-0 absolute inset-0 cursor-pointer"
                    value={editedProfile.image}
                    onChange={handleChange}
                  />
                </div>
              ) : (
                <img
                  src={profile.image}
                  alt={profile.name}
                  className="w-full h-full object-cover"
                />
              )}
            </div>
          </div>
        </motion.div>
        
        {/* Profile info */}
        <motion.div
          variants={containerVariants}
          className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-16"
        >
          {/* Left column - Basic Info */}
          <motion.div variants={itemVariants} className="space-y-6">
            <h2 className="text-xl font-bold text-gray-900 flex items-center">
              <Info size={20} className="mr-2 text-primary-500" />
              Basic Information
            </h2>
            
            <div className="bg-white rounded-xl shadow-sm p-6">
              {isEditing ? (
                <div className="space-y-4">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                      Restaurant Name
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      className="input"
                      value={editedProfile.name}
                      onChange={handleChange}
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                      Description
                    </label>
                    <textarea
                      id="description"
                      name="description"
                      rows={4}
                      className="input resize-none"
                      value={editedProfile.description}
                      onChange={handleChange}
                    ></textarea>
                  </div>
                  
                  <div>
                    <label htmlFor="cuisine" className="block text-sm font-medium text-gray-700 mb-1">
                      Cuisine Types (comma separated)
                    </label>
                    <input
                      type="text"
                      id="cuisine"
                      name="cuisine"
                      className="input"
                      value={editedProfile.cuisine.join(', ')}
                      onChange={handleCuisineChange}
                    />
                  </div>
                </div>
              ) : (
                <>
                  <h3 className="text-lg font-bold text-gray-900 mb-4">
                    {profile.name}
                  </h3>
                  
                  <p className="text-gray-600 mb-6">
                    {profile.description}
                  </p>
                  
                  <div className="flex flex-wrap gap-2">
                    {profile.cuisine.map((type, index) => (
                      <span
                        key={index}
                        className="inline-block bg-gray-100 text-gray-800 text-xs font-medium px-2.5 py-0.5 rounded-full"
                      >
                        {type}
                      </span>
                    ))}
                  </div>
                </>
              )}
            </div>
            
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
                <Tag size={18} className="mr-2 text-primary-500" />
                Contact Information
              </h3>
              
              {isEditing ? (
                <div className="space-y-4">
                  <div>
                    <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1">
                      Address
                    </label>
                    <input
                      type="text"
                      id="address"
                      name="address"
                      className="input"
                      value={editedProfile.address}
                      onChange={handleChange}
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                      Phone
                    </label>
                    <input
                      type="text"
                      id="phone"
                      name="phone"
                      className="input"
                      value={editedProfile.phone}
                      onChange={handleChange}
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                      Email
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      className="input"
                      value={editedProfile.email}
                      onChange={handleChange}
                    />
                  </div>
                </div>
              ) : (
                <div className="space-y-3">
                  <div className="flex">
                    <MapPin size={18} className="text-gray-500 mr-3 flex-shrink-0" />
                    <span className="text-gray-600">{profile.address}</span>
                  </div>
                  
                  <div className="flex">
                    <Phone size={18} className="text-gray-500 mr-3 flex-shrink-0" />
                    <span className="text-gray-600">{profile.phone}</span>
                  </div>
                  
                  <div className="flex">
                    <Mail size={18} className="text-gray-500 mr-3 flex-shrink-0" />
                    <span className="text-gray-600">{profile.email}</span>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
          
          {/* Right column - Hours & Images */}
          <motion.div variants={itemVariants} className="md:col-span-2 space-y-6">
            <h2 className="text-xl font-bold text-gray-900 flex items-center">
              <Clock size={20} className="mr-2 text-primary-500" />
              Opening Hours
            </h2>
            
            <div className="bg-white rounded-xl shadow-sm p-6">
              <div className="space-y-4">
                {editedProfile.openingHours.map((hours, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <span className="font-medium w-24">{hours.day}</span>
                    
                    {isEditing ? (
                      <div className="flex items-center space-x-4">
                        <div className="flex items-center">
                          <input
                            type="checkbox"
                            id={`closed-${index}`}
                            checked={hours.isClosed}
                            onChange={(e) => handleHoursChange(index, 'isClosed', e.target.checked)}
                            className="mr-2 h-4 w-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
                          />
                          <label htmlFor={`closed-${index}`} className="text-sm text-gray-700">
                            Closed
                          </label>
                        </div>
                        
                        {!hours.isClosed && (
                          <>
                            <input
                              type="time"
                              value={hours.open}
                              onChange={(e) => handleHoursChange(index, 'open', e.target.value)}
                              className="input py-1 px-2 w-32"
                            />
                            <span>to</span>
                            <input
                              type="time"
                              value={hours.close}
                              onChange={(e) => handleHoursChange(index, 'close', e.target.value)}
                              className="input py-1 px-2 w-32"
                            />
                          </>
                        )}
                      </div>
                    ) : (
                      <span className={hours.isClosed ? 'text-red-600 font-medium' : 'text-gray-600'}>
                        {hours.isClosed ? 'Closed' : `${hours.open} - ${hours.close}`}
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </div>
            
            <h2 className="text-xl font-bold text-gray-900 flex items-center pt-4">
              <Image size={20} className="mr-2 text-primary-500" />
              Restaurant Images
            </h2>
            
            <div className="bg-white rounded-xl shadow-sm p-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <h3 className="text-sm font-medium text-gray-700 mb-2">Logo Image</h3>
                  <div className="bg-gray-100 rounded-lg overflow-hidden aspect-square">
                    <img 
                      src={profile.image} 
                      alt="Restaurant logo" 
                      className="w-full h-full object-cover"
                    />
                  </div>
                  {isEditing && (
                    <input
                      type="text"
                      name="image"
                      className="input mt-2 text-xs"
                      placeholder="Logo image URL"
                      value={editedProfile.image}
                      onChange={handleChange}
                    />
                  )}
                </div>
                
                <div>
                  <h3 className="text-sm font-medium text-gray-700 mb-2">Banner Image</h3>
                  <div className="bg-gray-100 rounded-lg overflow-hidden aspect-video">
                    <img 
                      src={profile.banner} 
                      alt="Restaurant banner" 
                      className="w-full h-full object-cover"
                    />
                  </div>
                  {isEditing && (
                    <input
                      type="text"
                      name="banner"
                      className="input mt-2 text-xs"
                      placeholder="Banner image URL"
                      value={editedProfile.banner}
                      onChange={handleChange}
                    />
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
        
        {/* Action buttons */}
        {isEditing && (
          <motion.div variants={itemVariants} className="flex justify-end space-x-4">
            <button
              className="btn btn-secondary"
              onClick={toggleEditMode}
            >
              Cancel
            </button>
            <button
              className="btn btn-primary"
              onClick={handleSubmit}
            >
              Save Changes
            </button>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
};

export default ProfilePage;
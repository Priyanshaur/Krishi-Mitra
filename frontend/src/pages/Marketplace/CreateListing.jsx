import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { createMarketItem } from '../../store/slices/marketSlice'
import { Card, CardContent, CardHeader } from '../../components/ui/Card'
import Button from '../../components/ui/Button'
import Input from '../../components/ui/Input'
import { X, Upload, Plus } from 'lucide-react'
import toast from 'react-hot-toast'

const CreateListing = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { loading } = useSelector(state => state.market)
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    unit: 'kg',
    quantity: '',
    category: 'vegetables',
    qualityGrade: 'standard',
    organic: false,
    harvestDate: '',
    location: {
      city: '',
      state: '',
      pincode: ''
    },
    tags: []
  })
  
  const [tagInput, setTagInput] = useState('')
  const [images, setImages] = useState([])
  const [imagePreviews, setImagePreviews] = useState([])

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    if (name.includes('.')) {
      // Handle nested fields like location.city
      const [parent, child] = name.split('.')
      setFormData(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: value
        }
      }))
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: type === 'checkbox' ? checked : value
      }))
    }
  }

  const handleTagAdd = () => {
    if (tagInput.trim() && !formData.tags.includes(tagInput.trim())) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, tagInput.trim()]
      }))
      setTagInput('')
    }
  }

  const handleTagRemove = (tagToRemove) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }))
  }

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files)
    const newImages = []
    const newPreviews = []
    
    files.forEach(file => {
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        toast.error('Image size should be less than 5MB')
        return
      }
      
      newImages.push(file)
      newPreviews.push(URL.createObjectURL(file))
    })
    
    if (images.length + newImages.length > 5) {
      toast.error('You can upload maximum 5 images')
      return
    }
    
    setImages(prev => [...prev, ...newImages])
    setImagePreviews(prev => [...prev, ...newPreviews])
  }

  const handleImageRemove = (index) => {
    const newPreviews = [...imagePreviews]
    const newImages = [...images]
    
    URL.revokeObjectURL(newPreviews[index])
    newPreviews.splice(index, 1)
    newImages.splice(index, 1)
    
    setImagePreviews(newPreviews)
    setImages(newImages)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    // Validation
    if (!formData.title || !formData.price || !formData.quantity) {
      toast.error('Please fill all required fields')
      return
    }
    
    if (isNaN(formData.price) || isNaN(formData.quantity)) {
      toast.error('Price and quantity must be numbers')
      return
    }
    
    try {
      // Prepare form data for submission
      const submitData = {
        ...formData,
        price: Number(formData.price),
        quantity: Number(formData.quantity),
        location: {
          city: formData.location.city,
          state: formData.location.state,
          pincode: formData.location.pincode
        }
      }
      
      // Use image previews directly
      if (imagePreviews.length > 0) {
        submitData.images = imagePreviews.map((preview, index) => ({
          url: preview,
          publicId: `image_${Date.now()}_${index}`
        }))
      }
      
      const result = await dispatch(createMarketItem(submitData)).unwrap()
      toast.success('Listing created successfully!')
      navigate('/marketplace/my')
    } catch (error) {
      toast.error(error || 'Failed to create listing')
    }
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Create New Listing</h1>
        <Button 
          variant="outline" 
          onClick={() => navigate('/marketplace/my')}
          disabled={loading}
        >
          Cancel
        </Button>
      </div>
      
      <Card>
        <CardHeader>
          <h2 className="text-xl font-semibold text-gray-900">Product Details</h2>
          <p className="text-gray-600">Fill in all the details about your crop listing</p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Basic Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Product Title *
                </label>
                <Input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  placeholder="e.g., Organic Tomatoes - Premium Quality"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Category *
                </label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                >
                  <option value="vegetables">Vegetables</option>
                  <option value="fruits">Fruits</option>
                  <option value="cereals">Cereals</option>
                  <option value="pulses">Pulses</option>
                  <option value="spices">Spices</option>
                  <option value="others">Others</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Price (₹) *
                </label>
                <Input
                  type="number"
                  name="price"
                  value={formData.price}
                  onChange={handleChange}
                  placeholder="Enter price per unit"
                  min="0"
                  step="0.01"
                  required
                />
              </div>
              
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Unit *
                  </label>
                  <select
                    name="unit"
                    value={formData.unit}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  >
                    <option value="kg">kg</option>
                    <option value="quintal">quintal</option>
                    <option value="ton">ton</option>
                    <option value="bag">bag</option>
                    <option value="piece">piece</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Quantity *
                  </label>
                  <Input
                    type="number"
                    name="quantity"
                    value={formData.quantity}
                    onChange={handleChange}
                    placeholder="Available quantity"
                    min="0"
                    required
                  />
                </div>
              </div>
            </div>
            
            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Description
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                placeholder="Describe your product in detail..."
              />
            </div>
            
            {/* Quality Information */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Quality Grade
                </label>
                <select
                  name="qualityGrade"
                  value={formData.qualityGrade}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                >
                  <option value="premium">Premium</option>
                  <option value="grade-a">Grade A</option>
                  <option value="grade-b">Grade B</option>
                  <option value="standard">Standard</option>
                </select>
              </div>
              
              <div className="flex items-center">
                <input
                  type="checkbox"
                  name="organic"
                  checked={formData.organic}
                  onChange={handleChange}
                  className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
                />
                <label className="ml-2 block text-sm text-gray-700">
                  Organic Product
                </label>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Harvest Date
                </label>
                <Input
                  type="date"
                  name="harvestDate"
                  value={formData.harvestDate}
                  onChange={handleChange}
                />
              </div>
            </div>
            
            {/* Location */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  City *
                </label>
                <Input
                  type="text"
                  name="location.city"
                  value={formData.location.city}
                  onChange={handleChange}
                  placeholder="e.g., Pune"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  State *
                </label>
                <Input
                  type="text"
                  name="location.state"
                  value={formData.location.state}
                  onChange={handleChange}
                  placeholder="e.g., Maharashtra"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Pincode
                </label>
                <Input
                  type="text"
                  name="location.pincode"
                  value={formData.location.pincode}
                  onChange={handleChange}
                  placeholder="e.g., 411001"
                />
              </div>
            </div>
            
            {/* Tags */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Tags
              </label>
              <div className="flex flex-wrap gap-2 mb-2">
                {formData.tags.map((tag, index) => (
                  <span 
                    key={index} 
                    className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800"
                  >
                    {tag}
                    <button
                      type="button"
                      onClick={() => handleTagRemove(tag)}
                      className="ml-1 inline-flex items-center"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </span>
                ))}
              </div>
              <div className="flex">
                <Input
                  type="text"
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  placeholder="Add a tag and press Enter"
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleTagAdd())}
                  className="flex-1"
                />
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={handleTagAdd}
                  className="ml-2"
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </div>
            
            {/* Images */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Product Images
              </label>
              <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-lg">
                <div className="space-y-1 text-center">
                  <Upload className="mx-auto h-12 w-12 text-gray-400" />
                  <div className="flex text-sm text-gray-600">
                    <label className="relative cursor-pointer bg-white rounded-md font-medium text-green-600 hover:text-green-500">
                      <span>Upload images</span>
                      <input
                        type="file"
                        multiple
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="sr-only"
                      />
                    </label>
                    <p className="pl-1">or drag and drop</p>
                  </div>
                  <p className="text-xs text-gray-500">
                    PNG, JPG, GIF up to 5MB (max 5 images)
                  </p>
                </div>
              </div>
              
              {imagePreviews.length > 0 && (
                <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
                  {imagePreviews.map((preview, index) => (
                    <div key={index} className="relative">
                      <img
                        src={preview}
                        alt={`Preview ${index}`}
                        className="h-24 w-full object-cover rounded-lg"
                      />
                      <button
                        type="button"
                        onClick={() => handleImageRemove(index)}
                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
            
            {/* Submit Button */}
            <div className="flex justify-end">
              <Button 
                type="submit" 
                variant="primary" 
                loading={loading}
                disabled={loading}
              >
                {loading ? 'Creating...' : 'Create Listing'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}

export default CreateListing
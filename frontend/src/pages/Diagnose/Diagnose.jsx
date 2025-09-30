import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useForm } from 'react-hook-form'
import { Upload, Scan, AlertCircle, CheckCircle2, Download, History } from 'lucide-react'
import { Card, CardContent, CardHeader } from '../../components/ui/Card'
import Button from '../../components/ui/Button'
import { diagnoseDisease } from '../../store/slices/diagnosisSlice'

const Diagnose = () => {
  const [selectedImage, setSelectedImage] = useState(null)
  const [previewUrl, setPreviewUrl] = useState('')
  const [diagnosisResult, setDiagnosisResult] = useState(null)
  const [loading, setLoading] = useState(false)

  const dispatch = useDispatch()
  const { user } = useSelector(state => state.auth)
  const { currentDiagnosis, history } = useSelector(state => state.diagnosis)

  const { register, handleSubmit, watch } = useForm()
  const cropType = watch('cropType', 'tomato')

  const handleImageSelect = (event) => {
    const file = event.target.files[0]
    if (file) {
      setSelectedImage(file)
      setPreviewUrl(URL.createObjectURL(file))
      setDiagnosisResult(null)
    }
  }

  const onSubmit = async (data) => {
    if (!selectedImage) return

    setLoading(true)
    
    // Create FormData for image upload
    const formData = new FormData()
    formData.append('image', selectedImage)
    formData.append('cropType', data.cropType)
    formData.append('notes', data.notes)

    try {
      // This would dispatch the actual diagnosis action
      // await dispatch(diagnoseDisease(formData)).unwrap()
      
      // Mock result for demonstration
      setTimeout(() => {
        const mockResult = {
          disease: 'Early Blight',
          confidence: 0.92,
          scientificName: 'Alternaria solani',
          recommendations: {
            treatment: 'Remove affected leaves and apply fungicide. Ensure proper spacing between plants for air circulation.',
            prevention: 'Practice crop rotation and avoid overhead watering. Remove plant debris from previous seasons.',
            organicRemedies: ['Neem oil spray (2%)', 'Baking soda solution (1 tbsp per gallon)', 'Garlic-chili spray'],
            chemicalTreatments: ['Chlorothalonil', 'Mancozeb', 'Copper-based fungicides']
          },
          severity: 'medium'
        }
        setDiagnosisResult(mockResult)
        setLoading(false)
      }, 2000)
    } catch (error) {
      setLoading(false)
      console.error('Diagnosis failed:', error)
    }
  }

  const severityColors = {
    low: 'text-green-600 bg-green-50 border-green-200',
    medium: 'text-yellow-600 bg-yellow-50 border-yellow-200',
    high: 'text-orange-600 bg-orange-50 border-orange-200',
    critical: 'text-red-600 bg-red-50 border-red-200'
  }

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Crop Disease Diagnosis</h1>
          <p className="text-gray-600 mt-2">
            Upload an image of your crop leaf to detect diseases and get AI-powered recommendations
          </p>
        </div>
        <Button variant="outline">
          <History className="h-4 w-4 mr-2" />
          View History
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Upload Section */}
        <Card>
          <CardHeader>
            <h3 className="text-lg font-medium text-gray-900">Upload Image for Analysis</h3>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Crop Type</label>
                <select
                  {...register('cropType')}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                >
                  <option value="tomato">Tomato</option>
                  <option value="potato">Potato</option>
                  <option value="corn">Corn</option>
                  <option value="wheat">Wheat</option>
                  <option value="rice">Rice</option>
                  <option value="other">Other Crops</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Leaf Image</label>
                <div className="mt-1 flex justify-center px-6 pt-8 pb-8 border-2 border-gray-300 border-dashed rounded-xl hover:border-green-400 transition-colors cursor-pointer">
                  <label htmlFor="image-upload" className="text-center cursor-pointer">
                    {previewUrl ? (
                      <div className="space-y-4">
                        <img
                          src={previewUrl}
                          alt="Preview"
                          className="mx-auto h-48 w-48 object-cover rounded-lg shadow-md"
                        />
                        <p className="text-sm text-green-600">Image selected ✓</p>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        <Upload className="mx-auto h-12 w-12 text-gray-400" />
                        <div className="flex text-sm text-gray-600">
                          <span className="relative cursor-pointer bg-white rounded-md font-medium text-green-600 hover:text-green-500">
                            Upload an image
                          </span>
                          <p className="pl-1">or drag and drop</p>
                        </div>
                        <p className="text-xs text-gray-500">PNG, JPG, JPEG up to 10MB</p>
                      </div>
                    )}
                    <input
                      id="image-upload"
                      type="file"
                      className="sr-only"
                      accept="image/*"
                      onChange={handleImageSelect}
                    />
                  </label>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Additional Notes (Optional)
                </label>
                <textarea
                  {...register('notes')}
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="Describe any symptoms you've observed, weather conditions, or other relevant information..."
                />
              </div>

              <Button
                type="submit"
                variant="primary"
                size="large"
                loading={loading}
                disabled={!selectedImage}
                className="w-full"
              >
                <Scan className="h-4 w-4 mr-2" />
                Analyze Image
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Results Section */}
        <Card>
          <CardHeader>
            <h3 className="text-lg font-medium text-gray-900">Diagnosis Results</h3>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex items-center justify-center py-16">
                <div className="text-center">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
                  <p className="text-gray-600">Analyzing your image with AI...</p>
                  <p className="text-sm text-gray-500 mt-2">This may take a few seconds</p>
                </div>
              </div>
            ) : diagnosisResult ? (
              <div className="space-y-6">
                {/* Result Header */}
                <div className={`p-4 rounded-xl border-2 ${severityColors[diagnosisResult.severity]}`}>
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-bold text-lg">{diagnosisResult.disease}</h4>
                      <p className="text-sm opacity-75">{diagnosisResult.scientificName}</p>
                    </div>
                    <div className="text-right">
                      <span className="font-bold text-2xl">
                        {(diagnosisResult.confidence * 100).toFixed(1)}%
                      </span>
                      <p className="text-sm opacity-75">Confidence</p>
                    </div>
                  </div>
                </div>

                {/* Treatment Recommendations */}
                <div>
                  <h5 className="font-semibold text-gray-900 mb-3 flex items-center">
                    <CheckCircle2 className="h-5 w-5 text-green-500 mr-2" />
                    Recommended Treatment
                  </h5>
                  <p className="text-gray-700 bg-green-50 p-3 rounded-lg">{diagnosisResult.recommendations.treatment}</p>
                </div>

                {/* Prevention Tips */}
                <div>
                  <h5 className="font-semibold text-gray-900 mb-3">Prevention Tips</h5>
                  <p className="text-gray-700">{diagnosisResult.recommendations.prevention}</p>
                </div>

                {/* Treatment Options */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h6 className="font-medium text-green-700 mb-2">🌱 Organic Remedies</h6>
                    <ul className="text-sm text-gray-700 space-y-1">
                      {diagnosisResult.recommendations.organicRemedies.map((remedy, index) => (
                        <li key={index} className="flex items-start">
                          <span className="text-green-500 mr-2">•</span>
                          {remedy}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <h6 className="font-medium text-blue-700 mb-2">⚗️ Chemical Treatments</h6>
                    <ul className="text-sm text-gray-700 space-y-1">
                      {diagnosisResult.recommendations.chemicalTreatments.map((treatment, index) => (
                        <li key={index} className="flex items-start">
                          <span className="text-blue-500 mr-2">•</span>
                          {treatment}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex space-x-3">
                  <Button variant="primary" className="flex-1">
                    <Download className="h-4 w-4 mr-2" />
                    Save Report
                  </Button>
                  <Button variant="outline" className="flex-1">
                    Share Results
                  </Button>
                </div>
              </div>
            ) : (
              <div className="text-center py-16">
                <Scan className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500">Upload an image to get AI-powered diagnosis results</p>
                <p className="text-sm text-gray-400 mt-2">Supports 50+ common crop diseases</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Recent Diagnoses */}
      <Card>
        <CardHeader>
          <h3 className="text-lg font-medium text-gray-900">Recent Diagnoses</h3>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[1, 2, 3].map((item) => (
              <div key={item} className="bg-gray-50 p-4 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded">Tomato</span>
                  <span className="text-xs text-gray-500">2 days ago</span>
                </div>
                <p className="font-medium">Early Blight</p>
                <p className="text-sm text-gray-600">92% confidence</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default Diagnose
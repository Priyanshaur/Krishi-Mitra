import React, { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useForm } from 'react-hook-form'
import { Upload, Scan, AlertCircle, CheckCircle2, Download, History } from 'lucide-react'
import { Card, CardContent, CardHeader } from '../../components/ui/Card'
import Button from '../../components/ui/Button'
import { diagnoseDisease, fetchDiagnosisHistory } from '../../store/slices/diagnosisSlice'
import { testDiagnosisIntegration } from '../../test-diagnosis'

const Diagnose = () => {
  const [selectedImage, setSelectedImage] = useState(null)
  const [previewUrl, setPreviewUrl] = useState('')
  const [loading, setLoading] = useState(false)
  const [connectionStatus, setConnectionStatus] = useState({ ml: false, backend: false })
  const [error, setError] = useState(null)

  const dispatch = useDispatch()
  const { user } = useSelector(state => state.auth)
  const { currentDiagnosis, history, loading: reduxLoading, error: reduxError } = useSelector(state => state.diagnosis)

  const { register, handleSubmit, watch } = useForm()
  const cropType = watch('cropType', '')

  useEffect(() => {
    // Test connections when component mounts
    testDiagnosisIntegration().then(() => {
      // Update connection status based on actual tests
      setConnectionStatus({ ml: true, backend: true })
    });

    // Fetch diagnosis history
    dispatch(fetchDiagnosisHistory({ page: 1, limit: 3 }));
  }, [dispatch]);

  useEffect(() => {
    // Update local loading state based on Redux loading state
    setLoading(reduxLoading);
  }, [reduxLoading]);

  useEffect(() => {
    // Update local error state based on Redux error state
    setError(reduxError);
  }, [reduxError]);

  const handleImageSelect = (event) => {
    const file = event.target.files[0]
    if (file) {
      setSelectedImage(file)
      setPreviewUrl(URL.createObjectURL(file))
      setError(null)
    }
  }

  const onSubmit = async (data) => {
    if (!selectedImage || !data.cropType) return

    setLoading(true)
    setError(null)

    // Create FormData for image upload
    const formData = new FormData()
    formData.append('image', selectedImage)
    formData.append('cropType', data.cropType)
    formData.append('notes', data.notes)

    try {
      // Dispatch the actual diagnosis action
      console.log('Sending diagnosis request...')
      await dispatch(diagnoseDisease(formData)).unwrap()
      console.log('Diagnosis request sent successfully')
      // The result will be in currentDiagnosis from Redux state
    } catch (err) {
      console.error('Diagnosis failed:', err)
      setError(err.message || 'Failed to get diagnosis')
    } finally {
      setLoading(false)
    }
  }

  const severityColors = {
    low: 'text-green-600 bg-green-50 border-green-200',
    medium: 'text-yellow-600 bg-yellow-50 border-yellow-200',
    high: 'text-orange-600 bg-orange-50 border-orange-200',
    critical: 'text-red-600 bg-red-50 border-red-200'
  }

  // Use currentDiagnosis from Redux state instead of local state
  const diagnosisResult = currentDiagnosis;

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Crop Disease Diagnosis</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            Upload an image of your crop leaf to detect diseases and get AI-powered recommendations
          </p>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-center">
            <AlertCircle className="h-5 w-5 text-red-500 mr-2" />
            <span className="text-red-700 font-medium">Error: {error}</span>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Upload Section */}
        <Card>
          <CardHeader>
            <h3 className="text-lg font-medium text-gray-900 dark:text-white">Upload Image for Analysis</h3>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Crop Type</label>
                <select
                  {...register('cropType', { required: true })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white dark:bg-gray-800 dark:border-gray-600 dark:text-white"
                  defaultValue=""
                >
                  <option value="" disabled>Select a crop...</option>
                  <option value="tomato">Tomato</option>
                  <option value="potato">Potato</option>
                  <option value="corn">Corn</option>
                  <option value="wheat">Wheat</option>
                  <option value="rice">Rice</option>
                  <option value="other">Other Crops</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Leaf Image</label>
                <div className="mt-1 flex justify-center px-6 pt-8 pb-8 border-2 border-gray-300 dark:border-gray-600 border-dashed rounded-xl hover:border-green-400 dark:hover:border-green-500 transition-colors cursor-pointer bg-gray-50 dark:bg-gray-800/50">
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
                        <div className="flex text-sm text-gray-600 dark:text-gray-400">
                          <span className="relative cursor-pointer bg-white dark:bg-gray-700 rounded-md font-medium text-green-600 hover:text-green-500 px-2">
                            Upload an image
                          </span>
                          <p className="pl-1">or drag and drop</p>
                        </div>
                        <p className="text-xs text-gray-500 dark:text-gray-500">PNG, JPG, JPEG up to 10MB</p>
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
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Additional Notes (Optional)
                </label>
                <textarea
                  {...register('notes')}
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white dark:bg-gray-800 dark:border-gray-600 dark:text-white dark:placeholder-gray-400"
                  placeholder="Describe any symptoms you've observed, weather conditions, or other relevant information..."
                />
              </div>

              <Button
                type="submit"
                variant="primary"
                size="large"
                loading={loading}
                disabled={!selectedImage || !cropType}
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
            <h3 className="text-lg font-medium text-gray-900 dark:text-white">Diagnosis Results</h3>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex items-center justify-center py-16">
                <div className="text-center">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
                  <p className="text-gray-600 dark:text-gray-400">Analyzing your image with AI...</p>
                  <p className="text-sm text-gray-500 mt-2">This may take a few seconds</p>
                </div>
              </div>
            ) : diagnosisResult ? (
              <div className="space-y-6">
                {/* Result Header */}
                <div className={`p-4 rounded-xl border-2 ${severityColors[diagnosisResult.severity]}`}>
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-bold text-lg">{diagnosisResult.prediction_disease || 'Unknown Disease'}</h4>
                      <p className="text-sm opacity-75">{diagnosisResult.prediction_scientificName || 'Unknown'}</p>
                    </div>
                  </div>
                </div>

                {/* Treatment Recommendations */}
                <div>
                  <h5 className="font-semibold text-gray-900 dark:text-white mb-3 flex items-center">
                    <CheckCircle2 className="h-5 w-5 text-green-500 mr-2" />
                    Recommended Treatment
                  </h5>
                  <p className="text-gray-700 dark:text-gray-300 bg-green-50 dark:bg-green-900/20 p-3 rounded-lg">
                    No treatment recommendations available
                  </p>
                </div>

                {/* Prevention Tips */}
                <div>
                  <h5 className="font-semibold text-gray-900 dark:text-white mb-3">Prevention Tips</h5>
                  <p className="text-gray-700 dark:text-gray-300">
                    No prevention tips available
                  </p>
                </div>

                {/* Treatment Options */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h6 className="font-medium text-green-700 dark:text-green-400 mb-2">🌱 Organic Remedies</h6>
                    <ul className="text-sm text-gray-700 dark:text-gray-300 space-y-1">
                      <li className="flex items-start">
                        <span className="text-green-500 mr-2">•</span>
                        No organic remedies available
                      </li>
                    </ul>
                  </div>
                  <div>
                    <h6 className="font-medium text-blue-700 dark:text-blue-400 mb-2">⚗️ Chemical Treatments</h6>
                    <ul className="text-sm text-gray-700 dark:text-gray-300 space-y-1">
                      <li className="flex items-start">
                        <span className="text-blue-500 mr-2">•</span>
                        No chemical treatments available
                      </li>
                    </ul>
                  </div>
                </div>

                {/* Action Buttons - Removed Report Generation as requested */}
                <div className="flex space-x-3">
                  <Button variant="outline" className="flex-1 dark:text-white dark:border-gray-600">
                    Share Results
                  </Button>
                </div>
              </div>
            ) : (
              <div className="text-center py-16">
                <Scan className="h-16 w-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
                <p className="text-gray-500 dark:text-gray-400">Upload an image to get AI-powered diagnosis results</p>
                <p className="text-sm text-gray-400 dark:text-gray-500 mt-2">Supports 50+ common crop diseases</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Recent Diagnoses */}
      <Card>
        <CardHeader>
          <h3 className="text-lg font-medium text-gray-900 dark:text-white">Recent Diagnoses</h3>
        </CardHeader>
        <CardContent>
          {history && history.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {history.map((item) => (
                <div key={item.id} className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg border border-gray-100 dark:border-gray-700">
                  <div className="flex items-center justify-between mb-2">
                    <span className="bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300 text-xs px-2 py-1 rounded capitalize">{item.cropType}</span>
                    <span className="text-xs text-gray-500 dark:text-gray-400">{new Date(item.createdAt).toLocaleDateString()}</span>
                  </div>
                  <p className="font-medium text-gray-900 dark:text-white">{item.prediction_disease || 'Unknown'}</p>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500 dark:text-gray-400">
              <p>No recent diagnoses found.</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

export default Diagnose
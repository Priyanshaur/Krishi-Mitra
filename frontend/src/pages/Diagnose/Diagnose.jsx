import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useForm } from 'react-hook-form'
import { Upload, Scan, AlertCircle, CheckCircle2, Download } from 'lucide-react'
import { Card, CardContent, CardHeader } from '../../components/ui/Card'
import Button from '../../components/ui/Button'

const Diagnose = () => {
  const [selectedImage, setSelectedImage] = useState(null)
  const [previewUrl, setPreviewUrl] = useState('')
  const [diagnosisResult, setDiagnosisResult] = useState(null)
  const [loading, setLoading] = useState(false)

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
    const formData = new FormData()
    formData.append('image', selectedImage)
    formData.append('cropType', data.cropType)
    formData.append('notes', data.notes)

    try {
      // This would call the diagnosis API
      // const result = await diagnosisAPI.diagnose(formData)
      // setDiagnosisResult(result.data)
      
      // Mock result for demonstration
      setTimeout(() => {
        setDiagnosisResult({
          disease: 'Early Blight',
          confidence: 0.92,
          scientificName: 'Alternaria solani',
          recommendations: {
            treatment: 'Remove affected leaves and apply fungicide',
            prevention: 'Practice crop rotation and proper spacing',
            organicRemedies: ['Neem oil spray', 'Baking soda solution'],
            chemicalTreatments: ['Chlorothalonil', 'Mancozeb']
          },
          severity: 'medium'
        })
        setLoading(false)
      }, 2000)
    } catch (error) {
      setLoading(false)
      console.error('Diagnosis failed:', error)
    }
  }

  const severityColors = {
    low: 'text-green-600 bg-green-50',
    medium: 'text-yellow-600 bg-yellow-50',
    high: 'text-orange-600 bg-orange-50',
    critical: 'text-red-600 bg-red-50'
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Crop Disease Diagnosis</h1>
        <p className="text-gray-600 mt-2">
          Upload an image of your crop leaf to detect diseases and get AI-powered recommendations
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Upload Section */}
        <Card>
          <CardHeader>
            <h3 className="text-lg font-medium text-gray-900">Upload Image</h3>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div>
                <label className="label">Crop Type</label>
                <select
                  {...register('cropType')}
                  className="input-field"
                >
                  <option value="tomato">Tomato</option>
                  <option value="potato">Potato</option>
                  <option value="corn">Corn</option>
                  <option value="wheat">Wheat</option>
                  <option value="rice">Rice</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div>
                <label className="label">Leaf Image</label>
                <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-lg">
                  <div className="space-y-1 text-center">
                    {previewUrl ? (
                      <img
                        src={previewUrl}
                        alt="Preview"
                        className="mx-auto h-32 w-32 object-cover rounded-lg"
                      />
                    ) : (
                      <Upload className="mx-auto h-12 w-12 text-gray-400" />
                    )}
                    <div className="flex text-sm text-gray-600">
                      <label
                        htmlFor="image-upload"
                        className="relative cursor-pointer bg-white rounded-md font-medium text-primary-600 hover:text-primary-500 focus-within:outline-none"
                      >
                        <span>Upload an image</span>
                        <input
                          id="image-upload"
                          name="image-upload"
                          type="file"
                          className="sr-only"
                          accept="image/*"
                          onChange={handleImageSelect}
                        />
                      </label>
                      <p className="pl-1">or drag and drop</p>
                    </div>
                    <p className="text-xs text-gray-500">PNG, JPG up to 10MB</p>
                  </div>
                </div>
              </div>

              <div>
                <label className="label">Additional Notes (Optional)</label>
                <textarea
                  {...register('notes')}
                  rows={3}
                  className="input-field"
                  placeholder="Describe any symptoms you've observed..."
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
              <div className="flex items-center justify-center py-12">
                <div className="text-center">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
                  <p className="mt-4 text-gray-600">Analyzing your image...</p>
                </div>
              </div>
            ) : diagnosisResult ? (
              <div className="space-y-4">
                <div className={`p-4 rounded-lg ${
                  severityColors[diagnosisResult.severity]
                }`}>
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-semibold">{diagnosisResult.disease}</h4>
                      <p className="text-sm opacity-75">{diagnosisResult.scientificName}</p>
                    </div>
                    <div className="text-right">
                      <span className="font-bold text-lg">
                        {(diagnosisResult.confidence * 100).toFixed(1)}%
                      </span>
                      <p className="text-sm opacity-75">Confidence</p>
                    </div>
                  </div>
                </div>

                <div>
                  <h5 className="font-medium text-gray-900 mb-2">Recommended Treatment</h5>
                  <p className="text-sm text-gray-600">{diagnosisResult.recommendations.treatment}</p>
                </div>

                <div>
                  <h5 className="font-medium text-gray-900 mb-2">Prevention Tips</h5>
                  <p className="text-sm text-gray-600">{diagnosisResult.recommendations.prevention}</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h6 className="font-medium text-green-700 mb-2">Organic Remedies</h6>
                    <ul className="text-sm text-gray-600 space-y-1">
                      {diagnosisResult.recommendations.organicRemedies.map((remedy, index) => (
                        <li key={index}>• {remedy}</li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <h6 className="font-medium text-blue-700 mb-2">Chemical Treatments</h6>
                    <ul className="text-sm text-gray-600 space-y-1">
                      {diagnosisResult.recommendations.chemicalTreatments.map((treatment, index) => (
                        <li key={index}>• {treatment}</li>
                      ))}
                    </ul>
                  </div>
                </div>

                <Button variant="outline" className="w-full">
                  <Download className="h-4 w-4 mr-2" />
                  Download Full Report
                </Button>
              </div>
            ) : (
              <div className="text-center py-12">
                <Scan className="h-12 w-12 text-gray-300 mx-auto" />
                <p className="mt-4 text-gray-500">Upload an image to get diagnosis results</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default Diagnose
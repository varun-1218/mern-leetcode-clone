// import { useParams } from 'react-router';
// import React, { useState } from 'react';
// import { useForm } from 'react-hook-form';
// import axios from 'axios';
// import axiosClient from '../utils/axiosClient'

// function AdminUpload(){
    
//     const {problemId}  = useParams();
    
//     const [uploading, setUploading] = useState(false);
//     const [uploadProgress, setUploadProgress] = useState(0);
//     const [uploadedVideo, setUploadedVideo] = useState(null);
    
//       const {
//         register,
//         handleSubmit,
//         watch,
//         formState: { errors },
//         reset,
//         setError,
//         clearErrors
//       } = useForm();
    
//       const selectedFile = watch('videoFile')?.[0];
    
//       // Upload video to Cloudinary
//       const onSubmit = async (data) => {
//         const file = data.videoFile[0];
        
//         setUploading(true);
//         setUploadProgress(0);
//         clearErrors();
    
//         try {
//           // Step 1: Get upload signature from backend
//           const signatureResponse = await axiosClient.get(`/video/create/${problemId}`);
//           const { signature, timestamp, public_id, api_key, cloud_name, upload_url } = signatureResponse.data;
    
//           // Step 2: Create FormData for Cloudinary upload
//           const formData = new FormData();
//           formData.append('file', file);
//           formData.append('signature', signature);
//           formData.append('timestamp', timestamp);
//           formData.append('public_id', public_id);
//           formData.append('api_key', api_key);
    
//           // Step 3: Upload directly to Cloudinary
//           const uploadResponse = await axios.post(upload_url, formData, {
//             headers: {
//               'Content-Type': 'multipart/form-data',
//             },
//             onUploadProgress: (progressEvent) => {
//               const progress = Math.round((progressEvent.loaded * 100) / progressEvent.total);
//               setUploadProgress(progress);
//             },
//           });
    
//           const cloudinaryResult = uploadResponse.data;
    
//           // Step 4: Save video metadata to backend
//           const metadataResponse = await axiosClient.post('/video/save', {
//             problemId:problemId,
//             cloudinaryPublicId: cloudinaryResult.public_id,
//             secureUrl: cloudinaryResult.secure_url,
//             duration: cloudinaryResult.duration,
//           });
    
//           setUploadedVideo(metadataResponse.data.videoSolution);
//           reset(); // Reset form after successful upload
          
//         } catch (err) {
//           console.error('Upload error:', err);
//           setError('root', {
//             type: 'manual',
//             message: err.response?.data?.message || 'Upload failed. Please try again.'
//           });
//         } finally {
//           setUploading(false);
//           setUploadProgress(0);
//         }
//       };
    
//       // Format file size
//       const formatFileSize = (bytes) => {
//         if (bytes === 0) return '0 Bytes';
//         const k = 1024;
//         const sizes = ['Bytes', 'KB', 'MB', 'GB'];
//         const i = Math.floor(Math.log(bytes) / Math.log(k));
//         return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
//       };
    
//       // Format duration
//       const formatDuration = (seconds) => {
//         const mins = Math.floor(seconds / 60);
//         const secs = Math.floor(seconds % 60);
//         return `${mins}:${secs.toString().padStart(2, '0')}`;
//       };
    
//       return (
//         <div className="max-w-md mx-auto p-6">
//           <div className="card bg-base-100 shadow-xl">
//             <div className="card-body">
//               <h2 className="card-title">Upload Video</h2>
              
//               <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
//                 {/* File Input */}
//                 <div className="form-control w-full">
//                   <label className="label">
//                     <span className="label-text">Choose video file</span>
//                   </label>
//                   <input
//                     type="file"
//                     accept="video/*"
//                     {...register('videoFile', {
//                       required: 'Please select a video file',
//                       validate: {
//                         isVideo: (files) => {
//                           if (!files || !files[0]) return 'Please select a video file';
//                           const file = files[0];
//                           return file.type.startsWith('video/') || 'Please select a valid video file';
//                         },
//                         fileSize: (files) => {
//                           if (!files || !files[0]) return true;
//                           const file = files[0];
//                           const maxSize = 100 * 1024 * 1024; // 100MB
//                           return file.size <= maxSize || 'File size must be less than 100MB';
//                         }
//                       }
//                     })}
//                     className={`file-input file-input-bordered w-full ${errors.videoFile ? 'file-input-error' : ''}`}
//                     disabled={uploading}
//                   />
//                   {errors.videoFile && (
//                     <label className="label">
//                       <span className="label-text-alt text-error">{errors.videoFile.message}</span>
//                     </label>
//                   )}
//                 </div>
    
//                 {/* Selected File Info */}
//                 {selectedFile && (
//                   <div className="alert alert-info">
//                     <div>
//                       <h3 className="font-bold">Selected File:</h3>
//                       <p className="text-sm">{selectedFile.name}</p>
//                       <p className="text-sm">Size: {formatFileSize(selectedFile.size)}</p>
//                     </div>
//                   </div>
//                 )}
    
//                 {/* Upload Progress */}
//                 {uploading && (
//                   <div className="space-y-2">
//                     <div className="flex justify-between text-sm">
//                       <span>Uploading...</span>
//                       <span>{uploadProgress}%</span>
//                     </div>
//                     <progress 
//                       className="progress progress-primary w-full" 
//                       value={uploadProgress} 
//                       max="100"
//                     ></progress>
//                   </div>
//                 )}
    
//                 {/* Error Message */}
//                 {errors.root && (
//                   <div className="alert alert-error">
//                     <span>{errors.root.message}</span>
//                   </div>
//                 )}
    
//                 {/* Success Message */}
//                 {uploadedVideo && (
//                   <div className="alert alert-success">
//                     <div>
//                       <h3 className="font-bold">Upload Successful!</h3>
//                       <p className="text-sm">Duration: {formatDuration(uploadedVideo.duration)}</p>
//                       <p className="text-sm">Uploaded: {new Date(uploadedVideo.uploadedAt).toLocaleString()}</p>
//                     </div>
//                   </div>
//                 )}
    
//                 {/* Upload Button */}
//                 <div className="card-actions justify-end">
//                   <button
//                     type="submit"
//                     disabled={uploading}
//                     className={`btn btn-primary ${uploading ? 'loading' : ''}`}
//                   >
//                     {uploading ? 'Uploading...' : 'Upload Video'}
//                   </button>
//                 </div>
//               </form>
            
//             </div>
//           </div>
//         </div>
//     );
// }


// export default AdminUpload;





import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router';
import axiosClient from '../utils/axiosClient';

const AdminUpload = () => {
  const { problemId } = useParams();
  const navigate = useNavigate();
  const [problem, setProblem] = useState(null);
  const [videoFile, setVideoFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    console.log("AdminUpload mounted with problemId:", problemId);
    fetchProblemDetails();
  }, [problemId]);

  const fetchProblemDetails = async () => {
    try {
      setLoading(true);
      console.log("Fetching problem details for ID:", problemId);
      
      const { data } = await axiosClient.get(`/problem/problemById/${problemId}`);
      console.log("Problem data received:", data);
      
      setProblem(data);
    } catch (err) {
      console.error("Error fetching problem details:", err);
      console.error("Error response:", err.response);
      
      let errorMessage = 'Failed to fetch problem details';
      if (err.response?.status === 404) {
        errorMessage = 'Problem not found';
      } else if (err.response?.data?.message) {
        errorMessage = err.response.data.message;
      } else if (err.message) {
        errorMessage = err.message;
      }
      
      setError(errorMessage);
      
      // Even if error, set default problem to allow upload
      const defaultProblem = {
        title: `Problem ID: ${problemId}`,
        difficulty: "Unknown",
        description: "Problem details could not be loaded",
        tags: []
      };
      setProblem(defaultProblem);
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      console.log("File selected:", file.name, "Size:", file.size, "Type:", file.type);
      
      if (file.size > 50 * 1024 * 1024) {
        setError('File size exceeds 50MB limit');
        return;
      }
      if (!file.type.startsWith('video/')) {
        setError('Please select a video file');
        return;
      }
      setVideoFile(file);
      setError('');
    }
  };

  const handleUpload = async () => {
    if (!videoFile) {
      setError('Please select a video file');
      return;
    }

    try {
      setUploading(true);
      setError('');
      setSuccess('');

      console.log("Starting upload process...");
      
      console.log("Getting Cloudinary signature...");
      const signatureRes = await axiosClient.get(`/video/create/${problemId}`);
      console.log("Signature data:", signatureRes.data);
      
      const { signature, timestamp, public_id, api_key, cloud_name, upload_url } = signatureRes.data;

      console.log("Uploading to Cloudinary...");
      
      const formData = new FormData();
      formData.append('file', videoFile);
      formData.append('api_key', api_key);
      formData.append('timestamp', timestamp);
      formData.append('public_id', public_id);
      formData.append('signature', signature);
      formData.append('cloud_name', cloud_name);

      const cloudinaryRes = await fetch(upload_url, {
        method: 'POST',
        body: formData,
      });

      console.log("Cloudinary response status:", cloudinaryRes.status);
      
      const cloudinaryData = await cloudinaryRes.json();
      console.log("Cloudinary response data:", cloudinaryData);

      if (!cloudinaryData.secure_url) {
        throw new Error('Cloudinary upload failed: ' + (cloudinaryData.error?.message || 'Unknown error'));
      }

      console.log("Saving video metadata...");
      const saveRes = await axiosClient.post('/video/save', {
        problemId,
        cloudinaryPublicId: cloudinaryData.public_id,
        secureUrl: cloudinaryData.secure_url,
        duration: cloudinaryData.duration,
      });

      console.log("Save response:", saveRes.data);
      
      setSuccess('Video uploaded successfully!');
      setTimeout(() => {
        navigate('/admin/video');
      }, 2000);

    } catch (err) {
      console.error('Upload error:', err);
      
      let errorMsg = err.response?.data?.error || err.message || 'Upload failed';
      if (err.message.includes('401')) {
        errorMsg = 'Cloudinary authentication failed. Check your API credentials.';
      }
      
      setError(errorMsg);
    } finally {
      setUploading(false);
    }
  };

  // Render loading state
  if (loading) {
    return (
      <div className="flex justify-center items-center h-64 flex-col">
        <span className="loading loading-spinner loading-lg mb-4"></span>
        <p>Loading problem details...</p>
        <p className="text-sm text-gray-500">Problem ID: {problemId}</p>
      </div>
    );
  }

  // Render main component
  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">Upload Solution Video</h1>
        <div className="text-gray-600">
          <p><strong>Problem:</strong> {problem?.title || 'Unknown'}</p>
          <p><strong>Difficulty:</strong> {problem?.difficulty || 'Unknown'}</p>
          <p><strong>Problem ID:</strong> {problemId}</p>
        </div>
      </div>

      <div className="card bg-base-100 shadow-xl p-6">
        {error && (
          <div className="alert alert-error mb-4">
            <div>
              <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current flex-shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>{error}</span>
            </div>
          </div>
        )}

        {success && (
          <div className="alert alert-success mb-4">
            <div>
              <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current flex-shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>{success}</span>
            </div>
          </div>
        )}

        <div className="form-control mb-6">
          <label className="label">
            <span className="label-text font-semibold">Choose Video File</span>
          </label>
          <input
            type="file"
            className="file-input file-input-bordered w-full"
            accept="video/*"
            onChange={handleFileChange}
            disabled={uploading}
          />
          <label className="label">
            <span className="label-text-alt">Max size: 50MB, Supported formats: MP4, AVI, MOV, etc.</span>
          </label>
        </div>

        {videoFile && (
          <div className="mb-6 p-4 bg-base-200 rounded-lg">
            <p><strong>Selected File:</strong> {videoFile.name}</p>
            <p><strong>Size:</strong> {(videoFile.size / (1024 * 1024)).toFixed(2)} MB</p>
            <p><strong>Type:</strong> {videoFile.type}</p>
          </div>
        )}

        <div className="flex justify-between">
          <button
            className="btn btn-outline"
            onClick={() => navigate('/admin/video')}
            disabled={uploading}
          >
            Back to List
          </button>
          <button
            className="btn btn-primary"
            onClick={handleUpload}
            disabled={!videoFile || uploading}
          >
            {uploading ? (
              <>
                <span className="loading loading-spinner loading-sm"></span>
                Uploading...
              </>
            ) : (
              'Upload Video'
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminUpload;
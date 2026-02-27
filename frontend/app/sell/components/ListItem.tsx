'use client';

import React, { useState, useRef, useEffect } from 'react';
import { X, Package, AlignLeft, Tag, ImageIcon, IndianRupee } from 'lucide-react';
import {
  createProduct,
  uploadProductImage,
  getCategories,
  type CategoryResponse,
} from '@/lib/api/products';
import { ApiError } from '@/lib/api/client';

// TypeScript interfaces
interface FormData {
  title: string;
  price: string;
  description: string;
  categoryId: string;
  condition: string;
  campus: string;
  acceptTrades: boolean;
}

interface UploadedImage {
  id: string;
  file: File;
  preview: string;
}

const CONDITIONS = [
  { value: '', label: 'Select condition' },
  { value: 'NEW', label: 'New' },
  { value: 'LIKE_NEW', label: 'Like New' },
  { value: 'GOOD', label: 'Good' },
  { value: 'FAIR', label: 'Fair' },
  { value: 'POOR', label: 'Poor' },
];

const campuses = [
  { value: '', label: 'Select a campus' },
  { value: 'Onakoor', label: 'LP Campus' },
  { value: 'Warriom Road', label: 'Warriom Road Campus' },
  { value: 'Pune', label: 'Pune Campus' },
];

const ListItem: React.FC = () => {
  const [formData, setFormData] = useState<FormData>({
    title: '',
    price: '',
    description: '',
    categoryId: '',
    condition: '',
    campus: '',
    acceptTrades: false,
  });

  const [uploadedImages, setUploadedImages] = useState<UploadedImage[]>([]);
  const [dragActive, setDragActive] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [apiCategories, setApiCategories] = useState<CategoryResponse[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    getCategories()
      .then(setApiCategories)
      .catch(() => {
        // Categories will remain empty; user can still submit without one
      });
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;

    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData(prev => ({
        ...prev,
        [name]: checked
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFiles(e.dataTransfer.files);
    }
  };

  const handleFiles = (files: FileList) => {
    Array.from(files).forEach(file => {
      if (file.type.startsWith('image/')) {
        const id = Math.random().toString(36).substr(2, 9);
        const preview = URL.createObjectURL(file);

        setUploadedImages(prev => [...prev, { id, file, preview }]);
      }
    });
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      handleFiles(e.target.files);
    }
  };

  const removeImage = (imageId: string) => {
    setUploadedImages(prev => {
      const imageToRemove = prev.find(img => img.id === imageId);
      if (imageToRemove) {
        URL.revokeObjectURL(imageToRemove.preview);
      }
      return prev.filter(img => img.id !== imageId);
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitError(null);
    setSubmitSuccess(false);

    try {
      // 1. Create the product
      const product = await createProduct({
        title: formData.title,
        description: formData.description,
        price: parseFloat(formData.price),
        quantity: 1,
        condition: formData.condition || undefined,
        categoryId: formData.categoryId ? Number(formData.categoryId) : undefined,
        isAvailable: true,
      });

      // 2. Upload images one by one; first image is the primary
      for (let i = 0; i < uploadedImages.length; i++) {
        const img = uploadedImages[i];
        await uploadProductImage(product.id, img.file, i === 0);
        URL.revokeObjectURL(img.preview);
      }

      // Reset form on success
      setFormData({
        title: '',
        price: '',
        description: '',
        categoryId: '',
        condition: '',
        campus: '',
        acceptTrades: false,
      });
      setUploadedImages([]);
      setSubmitSuccess(true);
    } catch (error) {
      if (error instanceof ApiError) {
        setSubmitError(error.message || 'Failed to list item. Please try again.');
      } else {
        setSubmitError('Unable to connect to the server. Please try again.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const inputClasses = `
    w-full px-4 py-3.5 border rounded-xl transition-all duration-200 text-sm
    focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent
    border-gray-200 bg-gray-50 hover:border-gray-300 focus:bg-white
    text-gray-900 placeholder-gray-400
  `;

  const iconClasses = `absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400`;

  return (
    <div className="min-h-screen bg-white relative overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute top-20 right-10 w-96 h-96 bg-gray-100 rounded-full blur-3xl opacity-30" />
      <div className="absolute bottom-20 left-10 w-96 h-96 bg-gray-50 rounded-full blur-3xl opacity-40" />

      {/* Main Content */}
      <div className="relative z-10 flex items-start justify-center min-h-screen py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-lg w-full">
          {/* Header */}
          <div className="text-center mb-10 animate-fade-in-up">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-900 rounded-2xl mb-6">
              <Package className="w-7 h-7 text-white" />
            </div>
            <h1 className="text-4xl font-bold text-gray-900 mb-3">
              List an Item
            </h1>
          </div>

          {/* Form card */}
          <div className="bg-white rounded-2xl shadow-xl shadow-gray-900/5 border border-gray-200 p-8 animate-fade-in-up-delay">
            {submitSuccess && (
              <div className="mb-5 bg-green-50 border border-green-200 rounded-xl p-4 text-sm text-green-800 font-medium">
                Item listed successfully! It will appear in the browse page shortly.
              </div>
            )}
            {submitError && (
              <div className="mb-5 bg-red-50 border border-red-200 rounded-xl p-4 text-sm text-red-800 font-medium">
                {submitError}
              </div>
            )}
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Title */}
              <div>
                <label htmlFor="title" className="block text-sm font-semibold text-gray-900 mb-2">
                  Title
                </label>
                <div className="relative">
                  <Tag className={iconClasses} />
                  <input
                    type="text"
                    id="title"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    placeholder="e.g. Vintage Desk Lamp"
                    className={`${inputClasses} pl-12`}
                    required
                  />
                </div>
              </div>

              {/* Price */}
              <div>
                <label htmlFor="price" className="block text-sm font-semibold text-gray-900 mb-2">
                  Price
                </label>
                <div className="relative">
                  <IndianRupee className={iconClasses} />
                  <input
                    type="number"
                    id="price"
                    name="price"
                    value={formData.price}
                    onChange={handleInputChange}
                    placeholder="250"
                    min="0"
                    step="10"
                    className={`${inputClasses} pl-12`}
                    required
                  />
                </div>
              </div>

              {/* Description */}
              <div>
                <label htmlFor="description" className="block text-sm font-semibold text-gray-900 mb-2">
                  Description
                </label>
                <div className="relative">
                  <AlignLeft className="absolute left-4 top-4 w-5 h-5 text-gray-400" />
                  <textarea
                    id="description"
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    rows={5}
                    placeholder="Describe your item's condition, features, and any other relevant details..."
                    className={`${inputClasses} pl-12 resize-none`}
                    required
                  />
                </div>
              </div>

              {/* Category */}
              <div>
                <label htmlFor="categoryId" className="block text-sm font-semibold text-gray-900 mb-2">
                  Category
                </label>
                <select
                  id="categoryId"
                  name="categoryId"
                  value={formData.categoryId}
                  onChange={handleInputChange}
                  className={`${inputClasses} cursor-pointer`}
                >
                  <option value="">Select a category</option>
                  {apiCategories.map(cat => (
                    <option key={cat.id} value={String(cat.id)}>
                      {cat.name}
                    </option>
                  ))}
                </select>
                {apiCategories.length === 0 && (
                  <p className="mt-1 text-xs text-gray-400">No categories loaded — categories can be added by an admin.</p>
                )}
              </div>

              {/* Condition */}
              <div>
                <label htmlFor="condition" className="block text-sm font-semibold text-gray-900 mb-2">
                  Condition
                </label>
                <select
                  id="condition"
                  name="condition"
                  value={formData.condition}
                  onChange={handleInputChange}
                  className={`${inputClasses} cursor-pointer`}
                >
                  {CONDITIONS.map(opt => (
                    <option key={opt.value} value={opt.value} disabled={opt.value === ''}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Campus */}
              <div>
                <label htmlFor="campus" className="block text-sm font-semibold text-gray-900 mb-2">
                  Campus
                </label>
                <select
                  id="campus"
                  name="campus"
                  value={formData.campus}
                  onChange={handleInputChange}
                  className={`${inputClasses} cursor-pointer`}
                  required
                >
                  {campuses.map(campus => (
                    <option key={campus.value} value={campus.value} disabled={campus.value === ''}>
                      {campus.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Photos Upload */}
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">
                  Photos
                </label>

                {/* Upload Area */}
                <div
                  className={`relative border-2 border-dashed rounded-2xl p-8 text-center transition-all duration-200 cursor-pointer ${
                    dragActive
                      ? 'border-gray-900 bg-gray-50'
                      : 'border-gray-200 hover:border-gray-300 bg-gray-50/50'
                  }`}
                  onDragEnter={handleDrag}
                  onDragLeave={handleDrag}
                  onDragOver={handleDrag}
                  onDrop={handleDrop}
                  onClick={() => fileInputRef.current?.click()}
                >
                  <div className="inline-flex items-center justify-center w-12 h-12 bg-gray-900 rounded-xl mb-4">
                    <ImageIcon className="w-6 h-6 text-white" />
                  </div>
                  <p className="text-sm font-semibold text-gray-900 mb-1">
                    Drag and drop photos here
                  </p>
                  <p className="text-sm text-gray-500">Or click to browse files</p>

                  <input
                    ref={fileInputRef}
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={handleFileSelect}
                    className="hidden"
                  />
                </div>

                {/* Image Previews */}
                {uploadedImages.length > 0 && (
                  <div className="mt-4 grid grid-cols-3 sm:grid-cols-4 gap-3">
                    {uploadedImages.map((image) => (
                      <div key={image.id} className="relative aspect-square rounded-xl overflow-hidden border border-gray-200 group">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={image.preview}
                          alt="Preview"
                          className="w-full h-full object-cover"
                        />
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            removeImage(image.id);
                          }}
                          className="absolute top-2 right-2 w-7 h-7 bg-gray-900 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-gray-800 shadow-sm"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Submit Button */}
              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={`
                    w-full flex justify-center items-center py-3.5 px-4 border border-transparent font-semibold rounded-xl text-white transition-all duration-200
                    ${isSubmitting
                      ? 'bg-gray-400 cursor-not-allowed'
                      : 'bg-gray-900 hover:bg-gray-800 shadow-lg shadow-gray-900/10 hover:shadow-xl hover:shadow-gray-900/20 hover:-translate-y-0.5 cursor-pointer'
                    }
                  `}
                >
                  {isSubmitting ? (
                    <div className="flex items-center">
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                      Posting Item...
                    </div>
                  ) : (
                    'Post Item'
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ListItem;

import React, { useState } from 'react';
import { X, Plus, Trash } from 'lucide-react';

const LessonPlanForm = ({ onSubmit, onCancel, initialData = null }) => {
  const [formData, setFormData] = useState({
    title: initialData?.title || '',
    subject: initialData?.subject || '',
    grade: initialData?.grade || '',
    date: initialData?.date || '',
    duration: initialData?.duration || '',
    objectives: initialData?.objectives || [''],
    materials: initialData?.materials || [''],
    notes: initialData?.notes || ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleObjectiveChange = (index, value) => {
    const newObjectives = [...formData.objectives];
    newObjectives[index] = value;
    setFormData(prev => ({
      ...prev,
      objectives: newObjectives
    }));
  };

  const handleMaterialChange = (index, value) => {
    const newMaterials = [...formData.materials];
    newMaterials[index] = value;
    setFormData(prev => ({
      ...prev,
      materials: newMaterials
    }));
  };

  const addObjective = () => {
    setFormData(prev => ({
      ...prev,
      objectives: [...prev.objectives, '']
    }));
  };

  const addMaterial = () => {
    setFormData(prev => ({
      ...prev,
      materials: [...prev.materials, '']
    }));
  };

  const removeObjective = (index) => {
    setFormData(prev => ({
      ...prev,
      objectives: prev.objectives.filter((_, i) => i !== index)
    }));
  };

  const removeMaterial = (index) => {
    setFormData(prev => ({
      ...prev,
      materials: prev.materials.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-lg p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold text-gray-800">
          {initialData ? 'Edit Lesson Plan' : 'Create New Lesson Plan'}
        </h2>
        <button
          type="button"
          onClick={onCancel}
          className="p-2 hover:bg-gray-100 rounded-lg"
        >
          <X size={20} className="text-gray-400" />
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Title
          </label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Subject
          </label>
          <input
            type="text"
            name="subject"
            value={formData.subject}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Grade
          </label>
          <select
            name="grade"
            value={formData.grade}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500"
            required
          >
            <option value="">Select Grade</option>
            {Array.from({ length: 12 }, (_, i) => (
              <option key={i + 1} value={`Grade ${i + 1}`}>
                Grade {i + 1}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Duration
          </label>
          <select
            name="duration"
            value={formData.duration}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500"
            required
          >
            <option value="">Select Duration</option>
            <option value="30 minutes">30 minutes</option>
            <option value="45 minutes">45 minutes</option>
            <option value="60 minutes">60 minutes</option>
            <option value="90 minutes">90 minutes</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Date
          </label>
          <input
            type="date"
            name="date"
            value={formData.date}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500"
            required
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Learning Objectives
        </label>
        <div className="space-y-2">
          {formData.objectives.map((objective, index) => (
            <div key={index} className="flex gap-2">
              <input
                type="text"
                value={objective}
                onChange={(e) => handleObjectiveChange(index, e.target.value)}
                className="flex-1 px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500"
                placeholder="Enter learning objective"
                required
              />
              {formData.objectives.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeObjective(index)}
                  className="p-2 hover:bg-red-50 text-red-600 rounded-lg"
                >
                  <Trash size={20} />
                </button>
              )}
            </div>
          ))}
          <button
            type="button"
            onClick={addObjective}
            className="text-yellow-600 hover:text-yellow-700 text-sm font-medium flex items-center gap-1"
          >
            <Plus size={16} />
            Add Objective
          </button>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Materials Needed
        </label>
        <div className="space-y-2">
          {formData.materials.map((material, index) => (
            <div key={index} className="flex gap-2">
              <input
                type="text"
                value={material}
                onChange={(e) => handleMaterialChange(index, e.target.value)}
                className="flex-1 px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500"
                placeholder="Enter required material"
                required
              />
              {formData.materials.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeMaterial(index)}
                  className="p-2 hover:bg-red-50 text-red-600 rounded-lg"
                >
                  <Trash size={20} />
                </button>
              )}
            </div>
          ))}
          <button
            type="button"
            onClick={addMaterial}
            className="text-yellow-600 hover:text-yellow-700 text-sm font-medium flex items-center gap-1"
          >
            <Plus size={16} />
            Add Material
          </button>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Additional Notes
        </label>
        <textarea
          name="notes"
          value={formData.notes}
          onChange={handleChange}
          rows={4}
          className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500"
          placeholder="Add any additional notes or instructions..."
        />
      </div>

      <div className="flex justify-end gap-4">
        <button
          type="button"
          onClick={onCancel}
          className="px-6 py-2 border border-gray-200 rounded-lg text-gray-600 hover:bg-gray-50"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="px-6 py-2 bg-yellow-500 hover:bg-yellow-600 text-white rounded-lg"
        >
          {initialData ? 'Update Plan' : 'Create Plan'}
        </button>
      </div>
    </form>
  );
};

export default LessonPlanForm; 
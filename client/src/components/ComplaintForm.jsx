import React, { useState, useEffect } from 'react';
import { FiUploadCloud, FiPaperclip, FiFileText, FiTag, FiAlertCircle } from 'react-icons/fi';
import { userService } from '../services/userService';
import { complaintService } from '../services/complaintService';
import { useToast } from '../context/ToastContext.jsx';
import { PRIORITY_OPTIONS } from '../utils/constants';
import Loader from './Loader.jsx';
import FloatingInput from './FloatingInput.jsx';
import Dropdown from './Dropdown.jsx';

export default function ComplaintForm({ onSuccess, onCancel }) {
  const toast = useToast();
  const [categories, setCategories] = useState([]);
  const [form, setForm] = useState({ title: '', description: '', category: '', priority: 'medium' });
  const [errors, setErrors] = useState({});
  const [file, setFile] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  // Categories still come from the existing GET /api/categories endpoint —
  // only the *rendering* of the picker changed, not where the data comes from.
  // useEffect(() => {
  //   userService.getCategories().then(({ data }) => setCategories(data.data.categories)).catch(() => {});
  // }, []);
//   useEffect(() => {
//   userService
//     .getCategories()
//     .then((res) => {
//       console.log("CATEGORY RESPONSE:", res);

//       const list =
//         res?.data?.data?.categories ||
//         res?.data?.categories ||
//         [];

//       setCategories(list);
//     })
//     .catch((err) => {
//       console.log("CATEGORY ERROR:", err);

//       setCategories([]);
//     });
// }, []);
useEffect(() => {
  userService
    .getCategories()
    .then((res) => {
      console.log("CATEGORY RESPONSE:", res);

      const list =
        res?.data?.data?.categories ||
        res?.data?.categories ||
        [];

      setCategories(list);

      // FIX: Dynamically set the default category state using a real ID from your database
      if (list.length > 0) {
        const firstCategory = list[0];
        const initialId = firstCategory._id || firstCategory.id;
        
        setForm((prevForm) => ({
          ...prevForm,
          category: initialId // Now sets a real database ObjectId automatically
        }));
      }
    })
    .catch((err) => {
      console.log("CATEGORY ERROR:", err);
      setCategories([]);
    });
}, []);

  // const categoryOptions = categories.map((c) => ({ value: c._id, label: c.name }));
//   const categoryOptions = (categories || []).map((c) => ({
//   value: c._id,
//   label: c.name
// }));
// Remap data defensively to prevent undefined properties from rendering empty spaces
const categoryOptions = (categories || []).map((c) => {
  return {
    value: c._id || c.id || String(c.name).toLowerCase(), 
    label: c.name || 'Unnamed Category'
  };
});

  const handleChange = (e) => setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const validate = () => {
    const next = {};
    if (form.title.trim().length < 3) next.title = 'Title must be at least 3 characters';
    if (form.description.trim().length < 10) next.description = 'Description must be at least 10 characters';
    if (!form.category) next.category = 'Please select a category';
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setSubmitting(true);
    try {
      const fd = new FormData();
      Object.entries(form).forEach(([k, v]) => fd.append(k, v));
      if (file) fd.append('attachment', file);

      await complaintService.create(fd);
      toast.success('Complaint submitted successfully');
      onSuccess?.();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to submit complaint');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <FloatingInput
        name="title"
        label="Title"
        icon={<FiFileText size={16} />}
        value={form.title}
        onChange={handleChange}
        error={errors.title}
        required
      />

      <FloatingInput
        as="textarea"
        rows={4}
        name="description"
        label="Describe the issue"
        value={form.description}
        onChange={handleChange}
        error={errors.description}
        required
      />

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="label-text">Category</label>
          <Dropdown
            name="category"
            placeholder="Select category"
            icon={<FiTag size={15} />}
            // options={categoryOptions}
            options={
  categoryOptions.length
    ? categoryOptions
    : [
        { value: "general", label: "General" },
        { value: "billing", label: "Billing" },
        { value: "technical", label: "Technical" },
        { value: "account", label: "Account" },
        { value: "support", label: "Support" }
      ]
}
            value={form.category}
            onChange={(val) => setForm((f) => ({ ...f, category: val }))}
            error={errors.category}
          />
        </div>
        <div>
          <label className="label-text">Priority</label>
          <Dropdown
            name="priority"
            icon={<FiAlertCircle size={15} />}
            options={PRIORITY_OPTIONS}
            value={form.priority}
            onChange={(val) => setForm((f) => ({ ...f, priority: val }))}
          />
        </div>
      </div>

      <div>
        <label className="label-text">Attachment (optional)</label>
        <label className="flex cursor-pointer items-center gap-3 rounded-xl border border-dashed border-slate-300 px-4 py-3 text-sm
          text-slate-500 transition-colors hover:border-violet-400
          dark:border-white/10 dark:text-gray-400 dark:hover:border-violet-400/50">
          {file ? <FiPaperclip /> : <FiUploadCloud />}
          <span className="truncate">{file ? file.name : 'Click to attach a file (max 5MB)'}</span>
          <input type="file" className="hidden" onChange={(e) => setFile(e.target.files[0])} />
        </label>
      </div>

      <div className="flex justify-end gap-3 pt-2">
        {onCancel && <button type="button" onClick={onCancel} className="btn-cinematic-ghost">Cancel</button>}
        <button type="submit" disabled={submitting} className="btn-cinematic">
          {submitting ? <Loader size="sm" /> : 'Submit Complaint'}
        </button>
      </div>
    </form>
  );
}

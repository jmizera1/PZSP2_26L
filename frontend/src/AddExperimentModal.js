import React, { useState } from 'react';
import './Profile.css';

const AddExperimentModal = ({ isOpen, onClose, currentUser, onExperimentAdded }) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    platform_name: '',
    workload: '',
    number_of_agents: '',
    number_of_repetitions: '',
    number_of_containers: '',
    message_size: '',
    group_size: '',
    ram: '',
    vcpu: '',
    throughput: '',
    latency: '',
    cpu_usage: ''
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(null);

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitError(null);
    
    const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:8001';
    
    const payload = {
        name: formData.name,
        description: formData.description,
        platform_name: formData.platform_name,
        workload: formData.workload,
        number_of_agents: parseInt(formData.number_of_agents, 10),
        number_of_repetitions: parseInt(formData.number_of_repetitions, 10),
        number_of_containers: parseInt(formData.number_of_containers, 10),
        message_size: parseInt(formData.message_size, 10),
        group_size: parseInt(formData.group_size, 10),
        ram: parseFloat(formData.ram),
        vcpu: formData.vcpu,
        throughput: parseFloat(formData.throughput),
        latency: parseFloat(formData.latency),
        cpu_usage: parseFloat(formData.cpu_usage),
        user_id: currentUser.user_id
    };
    
    try {
        const res = await fetch(`${apiUrl}/experiments/full`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });
        
        if (!res.ok) {
            throw new Error('Failed to create experiment. Please check all fields.');
        }
        
        setFormData({
            name: '', description: '', platform_name: '', workload: '',
            number_of_agents: '', number_of_repetitions: '', number_of_containers: '',
            message_size: '', group_size: '', ram: '', vcpu: '',
            throughput: '', latency: '', cpu_usage: ''
        });
        
        if (onExperimentAdded) {
            onExperimentAdded();
        }
        onClose();
    } catch (err) {
        setSubmitError(err.message);
    } finally {
        setIsSubmitting(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" style={{ maxWidth: '600px', maxHeight: '90vh', overflowY: 'auto' }} onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Add New Experiment</h2>
          <button className="modal-close" onClick={onClose} type="button">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>
        <form className="modal-form" onSubmit={handleSubmit}>
          {submitError && <div className="modal-error">{submitError}</div>}
          
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <div className="form-group" style={{ gridColumn: '1 / -1' }}>
              <label>Experiment Name <span className="required">*</span></label>
              <input type="text" name="name" value={formData.name} onChange={handleChange} required />
            </div>
            
            <div className="form-group" style={{ gridColumn: '1 / -1' }}>
              <label>Description <span className="required">*</span></label>
              <textarea name="description" value={formData.description} onChange={handleChange} rows={3} required />
            </div>

            <div className="form-group">
              <label>Platform Name <span className="required">*</span></label>
              <input type="text" name="platform_name" value={formData.platform_name} onChange={handleChange} placeholder="e.g. JADE" required />
            </div>

            <div className="form-group">
              <label>Workload <span className="required">*</span></label>
              <input type="text" name="workload" value={formData.workload} onChange={handleChange} required />
            </div>

            <div className="form-group">
              <label>Number of Agents <span className="required">*</span></label>
              <input type="number" name="number_of_agents" value={formData.number_of_agents} onChange={handleChange} required min="1" />
            </div>

            <div className="form-group">
              <label>Number of Repetitions <span className="required">*</span></label>
              <input type="number" name="number_of_repetitions" value={formData.number_of_repetitions} onChange={handleChange} required min="1" />
            </div>

            <div className="form-group">
              <label>Number of Containers <span className="required">*</span></label>
              <input type="number" name="number_of_containers" value={formData.number_of_containers} onChange={handleChange} required min="1" />
            </div>

            <div className="form-group">
              <label>Message Size (bytes) <span className="required">*</span></label>
              <input type="number" name="message_size" value={formData.message_size} onChange={handleChange} required min="1" />
            </div>

            <div className="form-group">
              <label>Group Size <span className="required">*</span></label>
              <input type="number" name="group_size" value={formData.group_size} onChange={handleChange} required min="1" />
            </div>

            <div className="form-group">
              <label>RAM (GB) <span className="required">*</span></label>
              <input type="number" step="0.1" name="ram" value={formData.ram} onChange={handleChange} required min="0.1" />
            </div>

            <div className="form-group">
              <label>vCPU <span className="required">*</span></label>
              <input type="text" name="vcpu" value={formData.vcpu} onChange={handleChange} placeholder="e.g. 2" required />
            </div>
            
            <div className="form-group">
              <label>Throughput (msg/s) <span className="required">*</span></label>
              <input type="number" step="0.1" name="throughput" value={formData.throughput} onChange={handleChange} required />
            </div>

            <div className="form-group">
              <label>Latency (ms) <span className="required">*</span></label>
              <input type="number" step="0.1" name="latency" value={formData.latency} onChange={handleChange} required />
            </div>

            <div className="form-group">
              <label>CPU Usage (%) <span className="required">*</span></label>
              <input type="number" step="0.1" name="cpu_usage" value={formData.cpu_usage} onChange={handleChange} required />
            </div>
          </div>

          <div className="modal-actions" style={{ marginTop: '24px' }}>
            <button type="button" className="btn-cancel" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn-submit" disabled={isSubmitting}>
              {isSubmitting ? 'Creating...' : 'Create Experiment'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddExperimentModal;

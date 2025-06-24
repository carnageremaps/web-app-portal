// Carnage Remaps Client Portal - Enhanced JavaScript
class CarnagePortal {
  constructor() {
    this.currentUser = {
      name: 'John Doe',
      email: 'john.doe@example.com',
      avatar: 'JD',
      accountType: 'Premium',
      memberSince: 'January 2024',
      lastLogin: 'June 24, 2025'
    };

    this.files = [
      {
        id: 1,
        fileName: 'golf_gti_stage2.bin',
        car: '2020 VW Golf GTI',
        type: 'Stage 2',
        uploadDate: '2025-06-20',
        status: 'completed',
        size: '512 KB',
        price: '£450'
      },
      {
        id: 2,
        fileName: 'bmw_m3_custom.hex',
        car: '2019 BMW M3',
        type: 'Custom',
        uploadDate: '2025-06-22',
        status: 'processing',
        size: '1.2 MB',
        progress: 65
      },
      {
        id: 3,
        fileName: 'audi_rs6_stage1.bin',
        car: '2021 Audi RS6',
        type: 'Stage 1',
        uploadDate: '2025-06-24',
        status: 'pending',
        size: '768 KB',
        price: '£350'
      }
    ];

    this.carModels = {
      audi: ['A3', 'A4', 'A5', 'A6', 'Q5', 'Q7', 'RS3', 'RS4', 'RS6', 'TT'],
      bmw: ['1 Series', '3 Series', '5 Series', 'X3', 'X5', 'M2', 'M3', 'M4', 'M5'],
      mercedes: ['A-Class', 'C-Class', 'E-Class', 'S-Class', 'GLC', 'GLE', 'AMG GT'],
      volkswagen: ['Golf', 'Polo', 'Passat', 'Tiguan', 'Arteon', 'Golf GTI', 'Golf R'],
      ford: ['Focus', 'Fiesta', 'Mustang', 'Kuga', 'Ranger', 'Focus ST', 'Focus RS']
    };

    this.init();
  }

  init() {
    this.setupEventListeners();
    this.updateDashboard();
    this.renderFilesTable();
    this.updateProfile();
    this.startActivitySimulation();
  }

  // Event Listeners
  setupEventListeners() {
    // File upload drag and drop
    this.setupFileUpload();
    
    // Form validation
    this.setupFormValidation();
    
    // Real-time search
    this.setupSearch();
    
    // Keyboard shortcuts
    this.setupKeyboardShortcuts();
    
    // Auto-save forms
    this.setupAutoSave();
  }

  setupFileUpload() {
    const dropZone = document.querySelector('.file-drop-zone');
    const fileInput = document.getElementById('fileInput');

    if (dropZone && fileInput) {
      // Drag and drop events
      dropZone.addEventListener('dragover', (e) => {
        e.preventDefault();
        dropZone.classList.add('dragover');
      });

      dropZone.addEventListener('dragleave', (e) => {
        e.preventDefault();
        dropZone.classList.remove('dragover');
      });

      dropZone.addEventListener('drop', (e) => {
        e.preventDefault();
        dropZone.classList.remove('dragover');
        const files = e.dataTransfer.files;
        if (files.length > 0) {
          this.handleFileSelection(files[0]);
        }
      });

      fileInput.addEventListener('change', (e) => {
        if (e.target.files.length > 0) {
          this.handleFileSelection(e.target.files[0]);
        }
      });
    }
  }

  handleFileSelection(file) {
    const allowedTypes = ['.bin', '.hex'];
    const maxSize = 10 * 1024 * 1024; // 10MB

    if (!allowedTypes.some(type => file.name.toLowerCase().endsWith(type.substring(1)))) {
      this.showNotification('Please select a .bin or .hex file', 'error');
      return;
    }

    if (file.size > maxSize) {
      this.showNotification('File size must be less than 10MB', 'error');
      return;
    }

    // Update UI to show selected file
    const dropZone = document.querySelector('.file-drop-zone');
    dropZone.innerHTML = `
      <div class="file-drop-icon">✅</div>
      <p><strong>${file.name}</strong> (${this.formatFileSize(file.size)})</p>
      <p style="font-size: 0.9rem; color: var(--text-secondary); margin-top: 0.5rem;">Click to change file</p>
    `;

    this.selectedFile = file;
  }

  setupFormValidation() {
    const forms = document.querySelectorAll('form');
    forms.forEach(form => {
      const inputs = form.querySelectorAll('input, select, textarea');
      inputs.forEach(input => {
        input.addEventListener('blur', () => this.validateField(input));
        input.addEventListener('input', () => this.clearFieldError(input));
      });
    });
  }

  validateField(field) {
    const value = field.value.trim();
    let isValid = true;
    let message = '';

    // Remove existing error styling
    this.clearFieldError(field);

    // Required field validation
    if (field.hasAttribute('required') && !value) {
      isValid = false;
      message = 'This field is required';
    }

    // Email validation
    if (field.type === 'email' && value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
      isValid = false;
      message = 'Please enter a valid email address';
    }

    // Year validation
    if (field.name === 'carYear' && value) {
      const year = parseInt(value);
      const currentYear = new Date().getFullYear();
      if (year < 1990 || year > currentYear) {
        isValid = false;
        message = `Year must be between 1990 and ${currentYear}`;
      }
    }

    if (!isValid) {
      this.showFieldError(field, message);
    }

    return isValid;
  }

  showFieldError(field, message) {
    field.style.borderColor = '#ff4444';
    
    // Remove existing error message
    const existingError = field.parentNode.querySelector('.field-error');
    if (existingError) {
      existingError.remove();
    }

    // Add error message
    const errorDiv = document.createElement('div');
    errorDiv.className = 'field-error';
    errorDiv.style.cssText = 'color: #ff4444; font-size: 0.8rem; margin-top: 0.5rem;';
    errorDiv.textContent = message;
    field.parentNode.appendChild(errorDiv);
  }

  clearFieldError(field) {
    field.style.borderColor = 'var(--border)';
    const errorDiv = field.parentNode.querySelector('.field-error');
    if (errorDiv) {
      errorDiv.remove();
    }
  }

  setupSearch() {
    // Add search functionality to files table
    const filesSection = document.getElementById('files');
    if (filesSection) {
      const searchInput = document.createElement('input');
      searchInput.type = 'text';
      searchInput.placeholder = 'Search files...';
      searchInput.style.cssText = `
        width: 100%; max-width: 400px; padding: 0.8rem 1rem; 
        border-radius: 8px; border: 1px solid var(--border); 
        background: rgba(255, 255, 255, 0.05); color: var(--text-primary); 
        margin-bottom: 1.5rem;
      `;
      
      const header = filesSection.querySelector('.content-header');
      header.appendChild(searchInput);

      searchInput.addEventListener('input', (e) => {
        this.filterFiles(e.target.value);
      });
    }
  }

  filterFiles(searchTerm) {
    const filteredFiles = this.files.filter(file => 
      file.fileName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      file.car.toLowerCase().includes(searchTerm.toLowerCase()) ||
      file.type.toLowerCase().includes(searchTerm.toLowerCase())
    );
    this.renderFilesTable(filteredFiles);
  }

  setupKeyboardShortcuts() {
    document.addEventListener('keydown', (e) => {
      // Ctrl/Cmd + Number keys for navigation
      if ((e.ctrlKey || e.metaKey) && e.key >= '1' && e.key <= '6') {
        e.preventDefault();
        const sections = ['dashboard', 'upload', 'files', 'profile', 'settings'];
        const index = parseInt(e.key) - 1;
        if (sections[index]) {
          this.showSection(sections[index]);
        }
      }

      // Escape to close modals/notifications
      if (e.key === 'Escape') {
        const notifications = document.querySelectorAll('.notification');
        notifications.forEach(n => n.remove());
      }
    });
  }

  setupAutoSave() {
    const textareas = document.querySelectorAll('textarea');
    textareas.forEach(textarea => {
      let saveTimeout;
      textarea.addEventListener('input', () => {
        clearTimeout(saveTimeout);
        saveTimeout = setTimeout(() => {
          const key = `autosave_${textarea.name || textarea.id}`;
          localStorage.setItem(key, textarea.value);
          this.showNotification('Draft saved', 'success', 2000);
        }, 2000);
      });

      // Restore saved content
      const key = `autosave_${textarea.name || textarea.id}`;
      const saved = localStorage.getItem(key);
      if (saved) {
        textarea.value = saved;
      }
    });
  }

  // Navigation
  showSection(sectionId) {
    // Hide all sections
    document.querySelectorAll('.section').forEach(s => {
      s.classList.remove('active');
      s.style.display = 'none';
    });

    // Show selected section
    const section = document.getElementById(sectionId);
    if (section) {
      section.style.display = 'block';
      section.classList.add('active');
    }

    // Update navigation
    document.querySelectorAll('.sidebar nav a').forEach(a => {
      a.classList.remove('active');
    });

    const activeLink = document.querySelector(`[onclick="showSection('${sectionId}')"]`);
    if (activeLink) {
      activeLink.classList.add('active');
    }

    // Update URL without page reload
    window.history.pushState({section: sectionId}, '', `#${sectionId}`);
  }

  // Dashboard Updates
  updateDashboard() {
    const stats = this.calculateStats();
    
    // Update stats cards with animation
    this.animateCounter('.card-value:nth-of-type(1)', stats.totalFiles);
    this.animateCounter('.card-value:nth-of-type(2)', stats.pendingQuotes);
    this.animateCounter('.card-value:nth-of-type(3)', stats.completedRemaps);

    // Update recent activity
    this.updateRecentActivity();
  }

  calculateStats() {
    return {
      totalFiles: this.files.length,
      pendingQuotes: this.files.filter(f => f.status === 'pending').length,
      completedRemaps: this.files.filter(f => f.status === 'completed').length,
      processingFiles: this.files.filter(f => f.status === 'processing').length
    };
  }

  animateCounter(selector, targetValue) {
    const element = document.querySelector(selector);
    if (!element) return;

    const startValue = 0;
    const duration = 1000;
    const startTime = performance.now();

    const animate = (currentTime) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      
      const currentValue = Math.floor(startValue + (targetValue - startValue) * this.easeOutCubic(progress));
      element.textContent = currentValue;

      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };

    requestAnimationFrame(animate);
  }

  easeOutCubic(t) {
    return 1 - Math.pow(1 - t, 3);
  }

  updateRecentActivity() {
    const recentFiles = this.files
      .sort((a, b) => new Date(b.uploadDate) - new Date(a.uploadDate))
      .slice(0, 3);

    const activityHtml = recentFiles.map(file => `
      <div style="margin-bottom: 0.8rem;">
        <p><strong>${file.car}</strong> - ${file.type} ${file.status}</p>
        <p style="font-size: 0.85rem; color: var(--text-secondary);">
          ${this.formatDate(file.uploadDate)}
        </p>
      </div>
    `).join('');

    const activityCard = document.querySelector('.card:nth-child(5) .card-description');
    if (activityCard) {
      activityCard.innerHTML = activityHtml;
    }
  }

  // File Management
  renderFilesTable(filesToRender = this.files) {
    const tbody = document.querySelector('.files-table tbody');
    if (!tbody) return;

    tbody.innerHTML = filesToRender.map(file => `
      <tr data-file-id="${file.id}" class="file-row">
        <td>
          <div style="display: flex; align-items: center; gap: 0.8rem;">
            <div style="width: 8px; height: 8px; border-radius: 50%; background: ${this.getStatusColor(file.status)};"></div>
            <div>
              <div style="font-weight: 600;">${file.fileName}</div>
              <div style="font-size: 0.8rem; color: var(--text-secondary);">${file.size}</div>
            </div>
          </div>
        </td>
        <td>${file.car}</td>
        <td>
          <span style="padding: 0.3rem 0.8rem; background: rgba(255, 221, 0, 0.1); color: var(--primary); border-radius: 12px; font-size: 0.8rem; font-weight: 600;">
            ${file.type}
          </span>
        </td>
        <td>${this.formatDate(file.uploadDate)}</td>
        <td>
          ${this.renderStatus(file)}
        </td>
        <td>
          ${this.renderFileActions(file)}
        </td>
      </tr>
    `).join('');

    // Add click handlers
    tbody.querySelectorAll('.file-row').forEach(row => {
      row.addEventListener('click', (e) => {
        if (!e.target.closest('button')) {
          this.showFileDetails(parseInt(row.dataset.fileId));
        }
      });
    });
  }

  renderStatus(file) {
    const statusClass = `status-${file.status}`;
    let statusText = file.status.charAt(0).toUpperCase() + file.status.slice(1);
    
    if (file.status === 'processing' && file.progress) {
      return `
        <div>
          <span class="status-badge ${statusClass}">${statusText}</span>
          <div style="width: 100px; height: 4px; background: rgba(255,255,255,0.1); border-radius: 2px; margin-top: 0.5rem;">
            <div style="width: ${file.progress}%; height: 100%; background: var(--primary); border-radius: 2px; transition: width 0.3s ease;"></div>
          </div>
        </div>
      `;
    }

    return `<span class="status-badge ${statusClass}">${statusText}</span>`;
  }

  renderFileActions(file) {
    const actions = [];

    switch (file.status) {
      case 'completed':
        actions.push(`<button onclick="portal.downloadFile(${file.id})" class="action-btn success">Download</button>`);
        actions.push(`<button onclick="portal.reorderFile(${file.id})" class="action-btn secondary">Reorder</button>`);
        break;
      case 'pending':
        actions.push(`<button onclick="portal.viewQuote(${file.id})" class="action-btn primary">View Quote</button>`);
        actions.push(`<button onclick="portal.cancelFile(${file.id})" class="action-btn danger">Cancel</button>`);
        break;
      case 'processing':
        actions.push(`<button disabled class="action-btn disabled">Processing...</button>`);
        break;
    }

    return actions.join(' ');
  }

  getStatusColor(status) {
    const colors = {
      completed: '#00ff00',
      processing: '#007bff',
      pending: '#ffa500',
      cancelled: '#ff4444'
    };
    return colors[status] || '#666';
  }

  // File Actions
  downloadFile(fileId) {
    const file = this.files.find(f => f.id === fileId);
    if (!file) return;

    this.showNotification(`Downloading ${file.fileName}...`, 'success');
    
    // Simulate download
    setTimeout(() => {
      // In a real app, this would trigger an actual download
      const link = document.createElement('a');
      link.href = '#'; // Would be actual file URL
      link.download = file.fileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      this.showNotification('Download completed!', 'success');
    }, 1000);
  }

  viewQuote(fileId) {
    const file = this.files.find(f => f.id === fileId);
    if (!file) return;

    const modal = this.createModal(`
      <h2 style="margin-bottom: 1.5rem; color: var(--primary);">Quote for ${file.car}</h2>
      <div style="background: rgba(255, 255, 255, 0.05); padding: 1.5rem; border-radius: 12px; margin-bottom: 1.5rem;">
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; margin-bottom: 1rem;">
          <div><strong>File:</strong> ${file.fileName}</div>
          <div><strong>Type:</strong> ${file.type}</div>
          <div><strong>Upload Date:</strong> ${this.formatDate(file.uploadDate)}</div>
          <div><strong>File Size:</strong> ${file.size}</div>
        </div>
        <hr style="border: none; border-top: 1px solid var(--border); margin: 1rem 0;">
        <div style="text-align: center;">
          <div style="font-size: 2rem; font-weight: bold; color: var(--primary); margin-bottom: 0.5rem;">${file.price}</div>
          <div style="color: var(--text-secondary);">Estimated completion: 24-48 hours</div>
        </div>
      </div>
      <div style="display: flex; gap: 1rem; justify-content: center;">
        <button onclick="portal.acceptQuote(${fileId})" class="action-btn primary" style="flex: 1;">Accept Quote</button>
        <button onclick="portal.closeModal()" class="action-btn secondary" style="flex: 1;">Maybe Later</button>
      </div>
    `);

    document.body.appendChild(modal);
  }

  acceptQuote(fileId) {
    const file = this.files.find(f => f.id === fileId);
    if (file) {
      file.status = 'processing';
      file.progress = 0;
      
      this.renderFilesTable();
      this.updateDashboard();
      this.closeModal();
      
      this.showNotification('Quote accepted! Processing has started.', 'success');
      
      // Simulate processing progress
      this.simulateProcessing(fileId);
    }
  }

  simulateProcessing(fileId) {
    const file = this.files.find(f => f.id === fileId);
    if (!file || file.status !== 'processing') return;

    const interval = setInterval(() => {
      file.progress = Math.min((file.progress || 0) + Math.random() * 15, 100);
      
      if (file.progress >= 100) {
        file.status = 'completed';
        file.progress = undefined;
        clearInterval(interval);
        
        this.showNotification(`🎉 ${file.car} tuning completed!`, 'success', 5000);
        this.updateDashboard();
      }
      
      this.renderFilesTable();
    }, 2000);
  }

  cancelFile(fileId) {
    const file = this.files.find(f => f.id === fileId);
    if (!file) return;

    const modal = this.createModal(`
      <h2 style="margin-bottom: 1rem; color: #ff4444;">Cancel Upload</h2>
      <p style="margin-bottom: 2rem; color: var(--text-secondary);">
        Are you sure you want to cancel the upload for <strong>${file.fileName}</strong>?
        This action cannot be undone.
      </p>
      <div style="display: flex; gap: 1rem; justify-content: center;">
        <button onclick="portal.confirmCancel(${fileId})" class="action-btn danger">Yes, Cancel</button>
        <button onclick="portal.closeModal()" class="action-btn secondary">Keep Upload</button>
      </div>
    `);

    document.body.appendChild(modal);
  }

  confirmCancel(fileId) {
    this.files = this.files.filter(f => f.id !== fileId);
    this.renderFilesTable();
    this.updateDashboard();
    this.closeModal();
    this.showNotification('Upload cancelled successfully', 'success');
  }

  reorderFile(fileId) {
    const file = this.files.find(f => f.id === fileId);
    if (!file) return;

    this.showNotification(`Reordering ${file.type} for ${file.car}...`, 'success');
    // In a real app, this would redirect to the upload form with pre-filled data
  }

  // File Upload Process
  async uploadFile(event) {
    event.preventDefault();
    
    const form = event.target;
    const formData = new FormData(form);
    const uploadBtn = document.getElementById('uploadBtn');
    const progressContainer = document.getElementById('uploadProgress');
    const progressFill = document.getElementById('progressFill');
    const statusText = document.getElementById('uploadStatus');

    // Validate form
    const inputs = form.querySelectorAll('input[required], select[required]');
    let isValid = true;
    
    inputs.forEach(input => {
      if (!this.validateField(input)) {
        isValid = false;
      }
    });

    if (!this.selectedFile) {
      this.showNotification('Please select a file to upload', 'error');
      return;
    }

    if (!isValid) {
      this.showNotification('Please fix the errors in the form', 'error');
      return;
    }

    // Start upload process
    uploadBtn.disabled = true;
    uploadBtn.innerHTML = '<div class="spinner"></div> <span>Uploading...</span>';
    progressContainer.style.display = 'block';

    try {
      // Simulate upload progress
      await this.simulateUpload(progressFill, statusText);
      
      // Create new file entry
      const newFile = {
        id: Date.now(),
        fileName: this.selectedFile.name,
        car: `${formData.get('carYear')} ${formData.get('carMake')} ${formData.get('carModel')}`,
        type: formData.get('tuningType').replace('-', ' ').split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' '),
        uploadDate: new Date().toISOString().split('T')[0],
        status: 'pending',
        size: this.formatFileSize(this.selectedFile.size),
        price: this.calculatePrice(formData.get('tuningType'))
      };

      this.files.unshift(newFile);
      
      // Reset form
      form.reset();
      this.resetFileDropZone();
      this.selectedFile = null;
      
      // Update UI
      this.renderFilesTable();
      this.updateDashboard();
      
      // Show success and redirect
      this.showNotification('File uploaded successfully! Quote will be ready soon.', 'success', 5000);
      
      setTimeout(() => {
        this.showSection('files');
      }, 2000);

    } catch (error) {
      this.showNotification('Upload failed. Please try again.', 'error');
      console.error('Upload error:', error);
    } finally {
      uploadBtn.disabled = false;
      uploadBtn.innerHTML = '<span>Upload File</span>';
      progressContainer.style.display = 'none';
    }
  }

  async simulateUpload(progressFill, statusText) {
    const stages = [
      { progress: 20, text: 'Validating file...' },
      { progress: 40, text: 'Uploading to server...' },
      { progress: 70, text: 'Processing file...' },
      { progress: 90, text: 'Generating quote...' },
      { progress: 100, text: 'Upload complete!' }
    ];

    for (const stage of stages) {
      await new Promise(resolve => setTimeout(resolve, 800));
      progressFill.style.width = `${stage.progress}%`;
      statusText.textContent = stage.text;
    }
  }

  calculatePrice(tuningType) {
    const prices = {
      'stage1': '£299',
      'stage2': '£449',
      'stage3': '£699',
      'dpf-delete': '£199',
      'egr-delete': '£149',
      'custom': '£899'
    };
    return prices[tuningType] || '£299';
  }

  resetFileDropZone() {
    const dropZone = document.querySelector('.file-drop-zone');
    dropZone.innerHTML = `
      <div class="file-drop-icon">📁</div>
      <p><strong>Click to browse</strong> or drag and drop your BIN/HEX file here</p>
      <p style="font-size: 0.9rem; color: var(--text-secondary); margin-top: 0.5rem;">Maximum file size: 10MB</p>
    `;
  }

  // Car Models Update
  updateModels() {
    const makeSelect = document.getElementById('carMake');
    const modelInput = document.getElementById('carModel');
    
    if (!makeSelect || !modelInput) return;

    const selectedMake = makeSelect.value;
    
    if (selectedMake && this.carModels[selectedMake]) {
      // Convert input to select for predefined models
      const modelSelect = document.createElement('select');
      modelSelect.id = 'carModel';
      modelSelect.name = 'carModel';
      modelSelect.required = true;
      modelSelect.innerHTML = `
        <option value="">Select Model</option>
        ${this.carModels[selectedMake].map(model => 
          `<option value="${model}">${model}</option>`
        ).join('')}
        <option value="other">Other (please specify in notes)</option>
      `;
      
      modelInput.parentNode.replaceChild(modelSelect, modelInput);
    } else {
      // Keep as text input for "other" or no selection
      if (modelInput.tagName === 'SELECT') {
        const textInput = document.createElement('input');
        textInput.type = 'text';
        textInput.id = 'carModel';
        textInput.name = 'carModel';
        textInput.placeholder = 'e.g. Golf GTI, M3, C63';
        textInput.required = true;
        
        modelInput.parentNode.replaceChild(textInput, modelInput);
      }
    }
  }

  // Profile Management
  updateProfile() {
    const profileInfo = document.querySelector('.profile-info');
    if (profileInfo) {
      profileInfo.innerHTML = `
        <h2>${this.currentUser.name}</h2>
        <p>${this.currentUser.email}</p>
      `;
    }

    const avatar = document.querySelector('.profile-avatar');
    if (avatar) {
      avatar.textContent = this.currentUser.avatar;
    }

    // Update account details
    const accountDetails = document.querySelector('.profile-card');
    if (accountDetails) {
      const stats = this.calculateStats();
      // Update the existing profile content with dynamic data
    }
  }

  // Activity Simulation
  startActivitySimulation() {
    // Simulate real-time updates
    setInterval(() => {
      this.simulateRealTimeUpdates();
    }, 30000); // Every 30 seconds
  }

  simulateRealTimeUpdates() {
    // Randomly update processing files
    const processingFiles = this.files.filter(f => f.status === 'processing');
    processingFiles.forEach(file => {
      if (Math.random() > 0.7) { // 30% chance
        file.progress = Math.min((file.progress || 0) + Math.random() * 10, 100);
        if (file.progress >= 100) {
          file.status = 'completed';
          file.progress = undefined;
          this.showNotification(`🎉 ${file.car} tuning completed!`, 'success', 5000);
        }
      }
    });

    this.renderFilesTable();
    this.updateDashboard();
  }

  // Utility Functions
  showNotification(message, type = 'info', duration = 4000) {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.innerHTML = `
      <div style="display: flex; align-items: center; gap: 0.8rem;">
        <div>${this.getNotificationIcon(type)}</div>
        <div>${message}</div>
        <button
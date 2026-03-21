import React, { useState } from 'react';
import Toast from './components/Toast';

const App: React.FC = () => {
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' | 'info' } | null>(null);

  const showToast = (message: string, type: 'success' | 'error' | 'info') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <h1 className="text-2xl font-bold mb-4">Toast Notification System</h1>
      <div className="flex gap-2">
        <button 
          onClick={() => showToast('Success message', 'success')}
          className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600"
        >
          Show Success Toast
        </button>
        <button 
          onClick={() => showToast('Error message', 'error')}
          className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600"
        >
          Show Error Toast
        </button>
        <button 
          onClick={() => showToast('Info message', 'info')}
          className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
        >
          Show Info Toast
        </button>
      </div>
      {toast && <Toast message={toast.message} type={toast.type} />}
    </div>
  );
};

export default App;
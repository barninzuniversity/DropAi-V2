import React, { useState } from 'react';
import { FiDownload, FiTrash2, FiUpload } from 'react-icons/fi';

const StorageManager = () => {
  // Example files - in a real app, these would come from an API
  const [files, setFiles] = useState([
    { id: 1, name: 'product-image-1.jpg', type: 'Image', size: '1.2 MB', uploaded: '2023-08-15' },
    { id: 2, name: 'product-spec.pdf', type: 'Document', size: '3.5 MB', uploaded: '2023-08-12' },
    { id: 3, name: 'banner-promo.png', type: 'Image', size: '2.1 MB', uploaded: '2023-08-10' },
    { id: 4, name: 'inventory.xlsx', type: 'Spreadsheet', size: '0.8 MB', uploaded: '2023-08-05' },
    { id: 5, name: 'documentation.docx', type: 'Document', size: '1.7 MB', uploaded: '2023-07-28' },
  ]);

  const handleDelete = (id) => {
    // In a real app, you would call an API to delete the file
    setFiles(files.filter(file => file.id !== id));
  };

  const handleDownload = (file) => {
    // In a real app, this would trigger a file download
    console.log(`Downloading file: ${file.name}`);
  };

  const handleUpload = () => {
    // In a real app, this would open a file picker and upload the selected file
    console.log('Upload file functionality would go here');
    
    // Mock adding a new file
    const newFile = {
      id: files.length + 1,
      name: `new-file-${files.length + 1}.pdf`,
      type: 'Document',
      size: '1.0 MB',
      uploaded: new Date().toISOString().split('T')[0]
    };
    
    setFiles([...files, newFile]);
  };

  return (
    <div className="bg-white shadow-md rounded-lg p-4 mb-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-bold text-gray-800">Storage Management</h2>
        <button
          onClick={handleUpload}
          className="px-4 py-2 bg-indigo-600 text-white rounded-md text-sm hover:bg-indigo-700 flex items-center"
        >
          <FiUpload className="mr-2" /> Upload New File
        </button>
      </div>
      
      <div className="p-4 mb-4 bg-gray-50 rounded-md">
        <p className="text-gray-600">
          Manage your files and digital assets. Upload, download, and delete files as needed.
        </p>
      </div>
      
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">File</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Size</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Uploaded</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {files.map((file) => (
              <tr key={file.id}>
                <td className="px-6 py-4 text-sm font-medium text-gray-900">
                  {file.name}
                </td>
                <td className="px-6 py-4 text-sm text-gray-500">
                  {file.type}
                </td>
                <td className="px-6 py-4 text-sm text-gray-500">
                  {file.size}
                </td>
                <td className="px-6 py-4 text-sm text-gray-500">
                  {file.uploaded}
                </td>
                <td className="px-6 py-4 text-sm font-medium">
                  <button 
                    onClick={() => handleDownload(file)}
                    className="text-indigo-600 hover:text-indigo-900 mr-3"
                  >
                    <FiDownload className="inline mr-1" /> Download
                  </button>
                  <button 
                    onClick={() => handleDelete(file.id)}
                    className="text-red-600 hover:text-red-900"
                  >
                    <FiTrash2 className="inline mr-1" /> Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default StorageManager;

import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import DataRow from './DataRow';
import { Menu, MenuButton, MenuItems, MenuItem } from '@headlessui/react';
import { ChevronDownIcon, MagnifyingGlassIcon } from '@heroicons/react/20/solid';
import View from './View';
import Edit from './Edit';

const Display = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('');
  const [selectedRow, setSelectedRow] = useState(null);
  const [viewOpen, setViewOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const data = useSelector((state) => state.csv.data);
  const headers = data.length > 0 ? Object.keys(data[0]) : [];
  const [filteredData, setFilteredData] = useState(data);

  const handleViewClick = (rowData) => {
    setSelectedRow(rowData);
    setViewOpen(true);
  };

  const handleEditClick = (rowData) => {
    setSelectedRow(rowData);
    setEditOpen(true);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (selectedFilter && searchQuery) {
      const filtered = data.filter(row =>
        row[selectedFilter]?.toString().toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredData(filtered);
    } else {
      setFilteredData(data);
    }
  };

  const handleEditComplete = (updatedRow) => {
    const newData = filteredData.map((row) => 
      row.id === updatedRow.id ? updatedRow : row
    );
    setFilteredData(newData);
    setEditOpen(false);
  };

  React.useEffect(() => {
    setFilteredData(data);
  }, [data]);

  return (
    <div className="p-6 mt-0">
      {/* Search Bar */}
      <div className="flex mb-4 space-x-2">
        <Menu as="div" className="relative inline-block text-left">
          <div>
            <MenuButton className="inline-flex w-48 justify-between items-center rounded-md bg-white px-3 py-3 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-500 hover:bg-gray-50">
              <span>
                {selectedFilter ? selectedFilter.charAt(0).toUpperCase() + selectedFilter.slice(1) : 'Select Filter'}
              </span>
              <ChevronDownIcon aria-hidden="true" className="-mr-1 h-5 w-5 text-black-400" />
            </MenuButton>
          </div>
          <MenuItems className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
            <div className="py-1">
              {headers.map((header, index) => (
                <MenuItem key={index}>
                  <button
                    onClick={() => setSelectedFilter(header)}
                    className="block w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100"
                  >
                    {header.charAt(0).toUpperCase() + header.slice(1)}
                  </button>
                </MenuItem>
              ))}
            </div>
          </MenuItems>
        </Menu>

        <input
          className="flex-grow border rounded px-4 py-2 bg-white text-gray-700 ring-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          type="search"
          placeholder="Search..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <button
          onClick={handleSearch}
          className="inline-flex items-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-indigo-600 shadow-sm ring-1 ring-inset ring-indigo-600 hover:bg-indigo-600 hover:text-white hover:ring-indigo-600"
        >
          <MagnifyingGlassIcon aria-hidden="true" className="-ml-0.5 mr-1.5 h-5 w-5" />
          Search
        </button>
      </div>

      {/* Scrollable Data Table */}
      <div className="overflow-y-auto max-h-96 shadow-md border border-gray-300 rounded-lg">
        <table className="min-w-full divide-y-2 divide-gray-200 bg-white text-sm">
          <thead className="bg-gray-50 sticky top-0 z-10">
            <tr>
              {headers.map((header, index) => (
                <th key={index} className="whitespace-nowrap px-4 py-2 font-medium text-gray-900">
                  {header.charAt(0).toUpperCase() + header.slice(1)}
                </th>
              ))}
              <th className="px-4 py-2"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {filteredData.map((row, index) => (
              <DataRow
                key={index}
                data={row}
                headers={headers}
                onViewClick={handleViewClick}
                onEditClick={handleEditClick}
              />
            ))}
          </tbody>
        </table>
      </div>

      {/* Edit Dialog */}
      {editOpen && <Edit open={editOpen} setOpen={setEditOpen} rowData={selectedRow} onComplete={handleEditComplete} />}
      
      {/* View Dialog */}
      {viewOpen && <View open={viewOpen} setOpen={setViewOpen} rowData={selectedRow} />}
    </div>
  );
}

export default Display;

import React from 'react';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import './ExportButton.css';

const ExportButton = ({ movies, filename = 'movies' }) => {
  const exportToExcel = () => {
    if (!movies || movies.length === 0) {
      alert('No movies to export!');
      return;
    }

    // Prepare data for Excel
    const exportData = movies.slice(0, 20).map((movie, index) => ({
      'Rank': index + 1,
      'Title': movie.title,
      'Rating': movie.vote_average,
      'Release Date': movie.release_date,
      'Overview': movie.overview,
      'Popularity': movie.popularity,
    }));

    // Create workbook and worksheet
    const worksheet = XLSX.utils.json_to_sheet(exportData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Movies');

    // Generate Excel file
    const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    const data = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
    
    saveAs(data, `${filename}_top20.xlsx`);
  };

  return (
    <button onClick={exportToExcel} className="export-btn">
      Export Top 20 as Excel file
    </button>
  );
};

export default ExportButton;

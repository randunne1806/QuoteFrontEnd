import React, { useState, useEffect } from 'react';
import './TableComponent.css'; // Import your stylesheet

const TableComponent = ({ data, onCheckedCellsChange }) => {
  // Initialize a state to manage the checked state of each checkbox
  const [checkedCells, setCheckedCells] = useState([]);

  useEffect(() => {
    console.log(checkedCells);
    onCheckedCellsChange(checkedCells);
  }, [checkedCells, onCheckedCellsChange]);

  // Function to handle checkbox change
  const handleCheckboxChange = (rowIndex, colIndex) => {
    const cellKey = `${rowIndex}-${colIndex}`;

    setCheckedCells((prevCheckedCells) => {
      if (prevCheckedCells.includes(cellKey)) {
        return prevCheckedCells.filter((cell) => cell !== cellKey);
      } else {
        return [...prevCheckedCells, cellKey];
      }
    });
  };

  return (
    <table>
      <thead>
        <tr>
          <th></th> {/* Top-left corner cell */}
          {data.columnLabels.map((label, index) => (
            <th key={index}>{label}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {data.rowLabels.map((rowLabel, rowIndex) => (
          <tr key={rowIndex}>
            <th>{rowLabel}</th> {/* Row label cell */}
            {data.values[rowIndex].map((value, colIndex) => (
              <td key={colIndex}>
                <input
                  type="checkbox"
                  checked={checkedCells.includes(`${rowIndex}-${colIndex}`)}
                  onChange={() => handleCheckboxChange(rowIndex, colIndex)}
                />
                {value}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default TableComponent;

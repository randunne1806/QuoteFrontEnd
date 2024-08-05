import React, { useState, useEffect } from 'react';
import './FileChecker.css'; // Import your CSS file
import TableComponent from './TableComponent';
import axios from 'axios';

const FileChecker = () => {
  const defaultQuantity = '100';
  const defaultLeadTime = '1 day';

  const [progress, setProgress] = useState(0);
  const [dataArray, setDataArray] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dropdown1Value, setDropdown1Value] = useState(defaultQuantity);
  const [dropdown2Value, setDropdown2Value] = useState(defaultLeadTime);
  const [showTable, setShowTable] = useState(false);
  const [generatedTable, setGeneratedTable] = useState([]);
  const [poNumber, setPONumber] = useState('');
  const [poFileNumber, setPOFileNumber] = useState('');
  const dropdownOptions1 = ['100', '200', '300', '400', '500'];
  const dropdownOptions2 = ['1 day', '2 days', '3 days', '4 days', '5 days'];
  const [selectedCells, setSelectedCells] = useState([]);
  const [selectedCellsInfo, setSelectedCellsInfo] = useState([]);
  const [formattedSelectedCellsInfo, setFormattedSelectedCellsInfo] = useState([]);
  const [displaySelectedCellsInfo, setDisplaySelectedCellsInfo] = useState(false);
  //const [tableData, setTableData] = useState([]); 
  
  const [tableData, setTableData] = useState({
    columnLabels: ['1 day'],
    rowLabels: ['100'],
    values: [['$$$']],
  });
  
  useEffect(() => {
    console.log("Selected Cells:", selectedCells);
  }, [selectedCells]);

  useEffect(() => {
    // Display checked cells information when selectedCellsInfo changes
    console.log('Selected Cells Info:', selectedCellsInfo);

    // Map cell keys to corresponding information
    const formattedCellsInfo = selectedCellsInfo.map(cellKey => {
      const [rowIndex, colIndex] = cellKey.split('-');
      return {
        rowLabel: tableData.rowLabels[rowIndex],
        columnLabel: tableData.columnLabels[colIndex],
        value: tableData.values[rowIndex][colIndex],
      };
    });

    // Update the state with the formatted information
    setFormattedSelectedCellsInfo(formattedCellsInfo);
  }, [selectedCellsInfo, tableData]);

  const handleButtonClick = (e) => {
    e.preventDefault();
  
    // Generate table data based on selected dropdown values
    const quantity = parseInt(dropdown1Value, 10);
    const leadTime = parseInt(dropdown2Value, 10);
    
    const rowLabels = dropdownOptions1.slice(0, (quantity/100));

    // Generate column labels based on dropdownOptions2
    const columnLabels = dropdownOptions2.slice(0, leadTime);
    //console.log(rowLabels);
    //console.log(columnLabels);
    // Generate values for each cell in the table
    let values = [];
    for (let i = 0; i < rowLabels.length; i++) {
      values[i] = [];
      for (let j = 0; j < columnLabels.length; j++) {
        // Create a pair and push it to the result array
        values[i][j] = '$$$';
      }
    }
    console.log({ columnLabels, rowLabels, values });
    setTableData({ columnLabels, rowLabels, values });
    //tableData = { columnLabels, rowLabels, values };
    // Update state variables
    //setGeneratedTable(tableData);
    setShowTable(true);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('http://localhost:5000/summary');
        setDataArray(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching data from the backend', error);
        setLoading(false);
      }
    };

    fetchData();

    const interval = setInterval(() => {
      setProgress((prevProgress) => {
        if (prevProgress >= 100) {
          clearInterval(interval);
          fetchData();
          return 100;
        }
        return prevProgress + 5;
      });
    }, 3000); // Update every 6 seconds for a total of 1 minute (10 intervals)

    return () => clearInterval(interval);
  }, []);

  const showProgressBar = progress < 100;

  const tableHeaders = ['PCB Size', 'PCB Thickness', 'Copper Layers', 'Surface Finish', 'Solder Mask', 'Solder Mask Color', 'Legend', 'Legend Color', 'Edge Connector Area', 'Peeloff Mask', 'Carbon Mask', 'Customer Panel Size', 'Max. Aspect Ratio on PTH', 'Pressing Stages', 'Drill Hole Density', 'Testable Points', 'Min SMD/BGA Size', 'Via in Pad', 'Stacked in Vias', 'Castellated', 'Anomalies'];

  const handlePlaceOrder = (e) => {
    e.preventDefault();
  
    // Perform any additional actions related to placing the order
  
    // Set the state with the formatted information
    setFormattedSelectedCellsInfo(
      selectedCellsInfo.map(cellKey => {
        const [rowIndex, colIndex] = cellKey.split('-');
        return {
          rowLabel: tableData.rowLabels[rowIndex],
          columnLabel: tableData.columnLabels[colIndex],
          value: tableData.values[rowIndex][colIndex],
        };
      })
    );
  
    // Set the state to display selected cells information
    setDisplaySelectedCellsInfo(true);
  };
  
  const handleCheckedCells = (checkedCells) => {
    // Do something with the checkedCells in the parent component
    console.log("Checked Cells in Parent Component:", checkedCells);
    setSelectedCellsInfo(checkedCells);
  };

  return (
    <div>
      {showProgressBar ? (
        <div>
          <p>Loading...</p>
          <div className="progress-container">
            <div className="progress" style={{ width: `${progress}%` }}>
              {progress}%
            </div>
          </div>
        </div>
      ) : (
        /* <iframe title="pdf" src={`http://localhost:5000/pdf`} width="100%" height="600px" /> */
        <div>
          <div className="image-container">
            <div className="image-with-text">
              <p className="label-text">Top View</p>
              <img className="myImage" src="http://localhost:5000/png" alt="Description of image 1" />
            </div>
            <div className="image-with-text">
              <p className="label-text">Bottom View</p>
              <img className="myImage" src="http://localhost:5000/pdf" alt="Description of image 2" />
            </div>
          </div>

          <div className="table-container">
            <h2 className="data-summary-title">Data Summary</h2>
            <table className="summary-table">
              <tbody>
                {tableHeaders.map((header, rowIndex) => (
                  <tr key={rowIndex}>
                    <td className="header-column">{header}</td>
                    <td>{dataArray[rowIndex]}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

            <div className="dropdown-container">
              <div className="dropdown-group">
                <label>Quantity:</label>
                <select value={dropdown1Value} onChange={(e) => setDropdown1Value(e.target.value)}>
                  {dropdownOptions1.map((option, index) => (
                    <option key={index} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </div>

              <div className="dropdown-group">
                <label>Lead Time:</label>
                <select value={dropdown2Value} onChange={(e) => setDropdown2Value(e.target.value)}>
                  {dropdownOptions2.map((option, index) => (
                    <option key={index} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </div>

              <div className="button-group">
                <button onClick={handleButtonClick}>Submit</button>
              </div>
            </div>

            {showTable && (
              <div>
                <h2 className="data-summary-title">Price Table</h2>
                <TableComponent data={tableData} onCheckedCellsChange={handleCheckedCells}/>
                
                {/* Additional input fields and button */}
                <div className="order-section">
                  <label>PO #:</label>
                  <input
                    type="text"
                    value={poNumber}
                    onChange={(e) => setPONumber(e.target.value)}
                  />
                  <label>PO File #:</label>
                  <input
                    type="text"
                    value={poFileNumber}
                    onChange={(e) => setPOFileNumber(e.target.value)}
                  />
                  <button onClick={handlePlaceOrder}>Place Order</button>
                </div>

                {/* Display selected cells information below the button */}
                {displaySelectedCellsInfo && (
                  <div className="selected-cells">
                    <h3>Order Summary:</h3>
                    <ul>
                      {formattedSelectedCellsInfo.map((cell, index) => (
                        <li key={index}>
                          <span className="cell-info">
                            {cell.rowLabel} boards with a lead time of {cell.columnLabel}
                            <span className="right-aligned-value">{cell.value}</span>
                          </span>
                        </li>
                      ))}
                    </ul>
                    <div className="total-line">
                      Total: <span className="right-aligned-value">$$$</span>
                    </div>
                  </div>
                )}
              </div>
            )}
        </div>
      )}
    </div>
  );
};

export default FileChecker;

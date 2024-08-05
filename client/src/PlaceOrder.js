import "./PlaceOrder.css";
import topImage from './top.png';
import bottomImage from './bottom.png';
import React, { useState } from 'react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { useNavigate } from 'react-router-dom';
import { useLocation } from 'react-router-dom';

function PlaceHolder(){
    const location = useLocation();
    const quote = location.state.quote;
    const navigate = useNavigate();
    const [clickedCells, setClickedCells] = useState([]);
    const [uploadClicked, setUploadClicked] = useState(false);
    const [quantities, setQuantities] = useState(Array(5).fill(''));
    const [count, setCount] = useState(0);
    const [leadTimes, setLeadTimes] = useState([]);
    const [selectedLeadTimes, setSelectedLeadTimes] = useState([]);
    const [quantity1, setquantity1Change] = useState();
    const [quantity2, setquantity2Change] = useState();
    const [quantity3, setquantity3Change] = useState();
    const [quantity4, setquantity4Change] = useState();
    const [quantity5, setquantity5Change] = useState();
    const [quoteOptions, setQuoteOptions] = useState({
        partNumber: null,
        revision: null,
        material: 'FR4',
        soldermask: 'None',
        soldermaskColor: 'Black',
        legend: 'None',
        legendColor: 'Black',
        finish: 'ENIG',
        leadTime: [],
        quantities: []
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setQuoteOptions({ ...quoteOptions, [name]: value});
      };

    

    const handleCheckboxClick = (event) => {
        const { value, checked } = event.target;
        if (checked) {
            // Add the selected value to an array in the state
            setSelectedLeadTimes([...selectedLeadTimes, value]);
            setQuoteOptions(prevState => ({
                ...prevState,
                leadTime: [...prevState.leadTime, value]
            }));
        } else {
            // Remove the deselected value from the array in the state
            setSelectedLeadTimes(selectedLeadTimes.filter(time => time !== value));
            setQuoteOptions(prevState => ({
                ...prevState,
                leadTime: prevState.leadTime.filter(time => time !== value)
            }));
        }
    };

    const handleQuantity1Change = (e) => {
        setquantity1Change(e.target.value);
        setQuoteOptions(prevQuoteOptions => ({
            ...prevQuoteOptions,
            quantities: [e.target.value, quantity2, quantity3, quantity4, quantity5]
        }));
    };

    const handleQuantity2Change = (e) => {
        setquantity2Change(e.target.value);
        setQuoteOptions(prevQuoteOptions => ({
            ...prevQuoteOptions,
            quantities: [quantity1, e.target.value, quantity3, quantity4, quantity5]
        }));
    };
    const handleQuantity3Change = (e) => {
        setquantity3Change(e.target.value);
        setQuoteOptions(prevQuoteOptions => ({
            ...prevQuoteOptions,
            quantities: [quantity1, quantity2, e.target.value, quantity4, quantity5]
        }));
    };
    const handleQuantity4Change = (e) => {
        setquantity4Change(e.target.value);
        setQuoteOptions(prevQuoteOptions => ({
            ...prevQuoteOptions,
            quantities: [quantity1, quantity2, quantity3, e.target.value, quantity5]
        }));
    };
    const handleQuantity5Change = (e) => {
        console.log(quoteOptions.leadTime);
        setquantity5Change(e.target.value);
        setQuoteOptions(prevQuoteOptions => ({
            ...prevQuoteOptions,
            quantities: [quantity1, quantity2, quantity3, quantity4, e.target.value]
        }));
    };

    const handleCellClick = (event, rowIndex, columnIndex) => {
        event.stopPropagation();
        // Create a new array to hold the clicked cells
        const newClickedCells = [...clickedCells];
        // Toggle the cell's presence in the array
        const cellIndex = `${rowIndex}-${columnIndex}`;
        if (newClickedCells.includes(cellIndex)) {
          // Remove the cell if it's already clicked
          const index = newClickedCells.indexOf(cellIndex);
          newClickedCells.splice(index, 1);
        } else {
          // Add the cell if it's not clicked
          newClickedCells.push(cellIndex);
        }
        // Update the state with the new clicked cells
        setClickedCells(newClickedCells);
      };

      const handlePlaceOrder = (e) => {
        e.preventDefault();
        navigate('/cartSummary');
      }

      const handleDownloadPDF = (event) => {
        event.stopPropagation();
        const card = document.querySelector('.quote-card.expandeddd'); // Select the card element
    
        // Use html2canvas to capture the card content as an image
        html2canvas(card, { scale: 2 }) // Adjust the scale factor as needed
            .then(canvas => {
                const imgData = canvas.toDataURL('image/png');
                const pdf = new jsPDF({
                    orientation: 'portrait', // or 'landscape'
                    unit: 'px', // or 'mm', 'cm', 'in'
                    format: [canvas.width, canvas.height] // set dimensions
                });
    
                // Add the captured image to the PDF
                pdf.addImage(imgData, 'PNG', 0, 0, canvas.width, canvas.height);
    
                // Download the PDF file
                pdf.save('quote.pdf');
            });
    };

    const handleUpload = (event) => {
        if (!quoteOptions.leadTime || quoteOptions.leadTime.length === 0) {
            alert("Lead time data is missing.");
            return; // Prevent further execution if leadTime is empty
        }

        if (!quoteOptions.quantities || quoteOptions.quantities.length !== 5 || quoteOptions.quantities.some(qty => qty === undefined)) {
            alert("Quantities data is missing or incomplete.");
            return; // Prevent further execution if quantities data is missing or incomplete
        }
        navigate("/pricingTable", {state: { quote, quoteOptions }});
    };

    const handleInputChange = (index, e) => {
        const newQuantities = [...quantities];
        newQuantities[index] = e.target.value;
        setQuantities(newQuantities);
    };

      const handleDropdownClick = (e) => {
        // Prevent the click event from bubbling up to the parent container
        e.stopPropagation();
      };

      const handleLeadTimeChange = (e) => {
        const selectedOptions = Array.from(e.target.selectedOptions, option => option.value);
        setLeadTimes(selectedOptions);
    };

    const handleBack = async () => {
        navigate("/myQuotes")
      };

    return(
        <div style={{maxWidth: '800px', margin: '0 auto'}}>
            <div className="header">
                <h1>Amitron Quoting: New Quote</h1>
                <button onClick={handleBack}>Back</button>
            </div>
            <div className={uploadClicked ? 'cart-container expanded' : 'cart-container'} style={{marginBottom: '20px'}}>
                <div className="expanded-info">
                    {/* Add images */}
                    <div>
                        <div className="quote-optionsss" onClick={(e) => e.stopPropagation()}>
                            <div className="dropdown-container">
                                <label htmlFor="materialType">Material Type:</label>
                                <select id="materialType" onClick={handleDropdownClick} name="material" value={quoteOptions.material} onChange={handleChange}>
                                    {/* Options for Material Type */}
                                    <option value="FR4">FR4</option>
                                    <option value="High Temp FR4">High Temp FR4</option>
                                    <option value="Aluminum Substrate">Aluminum Substrate</option>
                                    <option value="RF">RF</option>
                                </select>
                            </div>
                            <div className="dropdown-container">
                                <label htmlFor="soldermask1">Soldermask:</label>
                                <select id="soldermask1" onClick={handleDropdownClick} name="soldermask" value={quoteOptions.soldermask} onChange={handleChange}>
                                    {/* Options for Soldermask 1 */}
                                    <option value="None">None</option>
                                    <option value="1 Sided">1 Sided</option>
                                    <option value="2 Sided">2 Sided</option>
                                </select>
                                <select id="soldermask2" onClick={handleDropdownClick} name="soldermaskColor" value={quoteOptions.soldermaskColor} onChange={handleChange}>
                                    {/* Options for Soldermask 1 */}
                                    <option value="Black">Black</option>
                                    <option value="Blue">Blue</option>
                                    <option value="Clear">Clear</option>
                                    <option value="Green">Green</option>
                                    <option value="LED White">LED White</option>
                                    <option value="Light Blue">Light Blue</option>
                                    <option value="Light Green">Light Green</option>
                                    <option value="No Mask">No Mask</option>
                                    <option value="Orange">Orange</option>
                                    <option value="Pink">Pink</option>
                                    <option value="Purple">Purple</option>
                                    <option value="Red">Red</option>
                                    <option value="Taiyo LED White">Taiyo LED White</option>
                                    <option value="White">White</option>
                                    <option value="Yellow">Yellow</option>
                                </select>
                            </div>
                            <div className="dropdown-container">
                                <label htmlFor="legendType1">Legend Type:</label>
                                <select id="legendType1" onClick={handleDropdownClick} name="legend" value={quoteOptions.legend} onChange={handleChange}>
                                    {/* Options for Legend Type 1 */}
                                    <option value="None">None</option>
                                    <option value="1 Sided">1 Sided</option>
                                    <option value="2 Sided">2 Sided</option>
                                </select>
                                <select id="legendType2" onClick={handleDropdownClick} name="legendColor" value={quoteOptions.legendColor} onChange={handleChange}>
                                    {/* Options for Legend Type 1 */}
                                    <option value="Black">Black</option>
                                    <option value="Blue">Blue</option>
                                    <option value="Green">Green</option>
                                    <option value="Red">Red</option>
                                    <option value="White">White</option>
                                    <option value="Yellow">Yellow</option>
                                </select>
                            </div>
                            <div className="dropdown-container">
                                <label htmlFor="surfaceFinish">Surface Finish:</label>
                                <select id="surfaceFinish" onClick={handleDropdownClick} name="finish" value={quoteOptions.finish} onChange={handleChange}>
                                    {/* Options for Surface Finish */}
                                    <option value="ENIG">ENIG</option>
                                    <option value="HASL">HASL</option>
                                    <option value="Immersion Tin">Immersion Tin</option>
                                    <option value="LF HASL">LF HASL</option>
                                    <option value="OSP">OSP</option>
                                    <option value="Outside Gold FB">Outside Gold FB</option>
                                    <option value="Outside Gold Sel">Outside Gold Sel</option>
                                    <option value="Outside Gold SelwB">Outside Gold SelwB</option>
                                </select>
                            </div>
                            <div className="dropdown-container">
                                <label htmlFor="leadTime">Lead Time:</label>
                                <div>
                                    <label>
                                        <input type="checkbox" value="1 week" onClick={handleCheckboxClick} /> 1 Week
                                    </label>
                                    <label>
                                        <input type="checkbox" value="2 weeks" onClick={handleCheckboxClick} /> 2 Weeks
                                    </label>
                                    <label>
                                        <input type="checkbox" value="3 weeks" onClick={handleCheckboxClick} /> 3 Weeks
                                    </label>
                                </div>
                            </div>
                            <div className="quantity-container">
                                <label htmlFor="quantity1">Quantities:</label>
                                <input type="text" id="quantity1" name="quantity1" onChange={handleQuantity1Change}/>
                                <input type="text" id="quantity2" name="quantity2" onChange={handleQuantity2Change}/>
                                <input type="text" id="quantity3" name="quantity3" onChange={handleQuantity3Change}/>
                                <input type="text" id="quantity4" name="quantity4" onChange={handleQuantity4Change}/>
                                <input type="text" id="quantity5" name="quantity5" onChange={handleQuantity5Change}/>
                            </div>               
                        </div>
                    </div>
                    {!uploadClicked && (
                        <div>
                        <button className="upload-button" onClick={(event) => handleUpload(event)}>Get Estimate</button>
                        </div>
                    )}      
                    </div>

            </div>
        </div>
    );
}

export default PlaceHolder;
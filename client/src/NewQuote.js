import React, { useState, useRef, useEffect } from 'react';
import "./NewQuote.css";
import { useNavigate } from 'react-router-dom';
import html2pdf from 'html2pdf.js';
import axios from 'axios';

function NewQuote() {
    const [partNumber, setPartNumber] = useState('');
    const [revision, setRevision] = useState('');
    const [file, setFile] = useState(null);
    const [isNewPart, setIsNewPart] = useState(true);
    const [isNewVersion, setIsNewVersion] = useState(true);
    const [uploadClicked, setUploadClicked] = useState(false);
    const navigate = useNavigate();
    const [quantity1, setquantity1Change] = useState();
    const [quantity2, setquantity2Change] = useState();
    const [quantity3, setquantity3Change] = useState();
    const [quantity4, setquantity4Change] = useState();
    const [quantity5, setquantity5Change] = useState();
    const [quantities, setQuantities] = useState([]);
    const [formData, setFormData] = useState({
        contact: 'Purchase Agent',
        phone: '12345678901',
        customerEmail: 'example@email.com',
        partNumber: null,
        revision: null,
        soldermaskColor: 'Black',
        thickness: '50',
        finish: 'ENIG',
        legendColor: 'Black',
        material: 'Core',
        extCopper: '1.5 oz',
        intCopper: '1.5 oz',
    });

    const downloadPdfRef = useRef(null);

    const handleDownloadPDF = () => {
        const input = document.getElementById('content-to-pdf');
        console.log("test");
        html2pdf(input, {
            margin: 0.5,
            filename: 'quote.pdf',
            image: { type: 'jpeg', quality: 0.98 },
            html2canvas: { dpi: 192, letterRendering: true },
            jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' }
        });
    };

    const [quoteData, setQuoteData] = useState({
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

    const handleCheckboxClick = (event) => {
        const { value, checked } = event.target;
        if (checked) {
            // Add the selected value to the leadTime array in the quoteData state
            setQuoteData(prevState => ({
                ...prevState,
                leadTime: [...prevState.leadTime, value]
            }));
        } else {
            // Remove the deselected value from the leadTime array in the quoteData state
            setQuoteData(prevState => ({
                ...prevState,
                leadTime: prevState.leadTime.filter(time => time !== value)
            }));
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        console.log(formData);
        setFormData({ ...formData, [name]: value });
        setQuoteData({ ...quoteData, [name]: value});
        console.log(formData);
      };

    const handleDropdownChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevFormData => ({
            ...prevFormData,
            [name]: value
        }));
        console.log(formData);
    };

    const handleSoldermaskColorChange = (e) => {
        const { value } = e.target;
        console.log("Selected soldermask color:", value);
        setFormData(prevFormData => ({
            ...prevFormData,
            soldermaskColor: value
        }));
        setQuoteData(prevQuoteData => ({
            ...prevQuoteData,
            soldermaskColor: value
        }));
        console.log(formData);
        console.log(quoteData);
    };

    useEffect(() => {
        console.log('Component re-rendered with updated formData:', formData);
    }, [formData]);

    useEffect(() => {
        console.log('Component re-rendered with updated quoteData:', quoteData);
    }, [quoteData]);

    useEffect(() => {
        const fetchUserEmail = async () => {
          try {
            const response = await axios.get('/loggedinuseremail');
            console.log(response.data);
            setFormData(prevFormData => ({
                ...prevFormData,
                customerEmail: response.data.email
            }));
          } catch (error) {
            console.error('Error fetching specs:', error);
          }
        };
    
        fetchUserEmail();
      }, []);

      const handleChanges = (e) => {
        const { name, value } = e.target;

        // Update quoteData
        setQuoteData({ ...quoteData, [name]: value });

        // Update quantities array in quoteData when all 5 values are filled
        
      };

    const handleQuantity1Change = (e) => {
        setquantity1Change(e.target.value);
        setQuoteData(prevQuoteData => ({
            ...prevQuoteData,
            quantities: [e.target.value, quantity2, quantity3, quantity4, quantity5]
        }));
    };

    const handleQuantity2Change = (e) => {
        setquantity2Change(e.target.value);
        setQuoteData(prevQuoteData => ({
            ...prevQuoteData,
            quantities: [quantity1, e.target.value, quantity3, quantity4, quantity5]
        }));
    };
    const handleQuantity3Change = (e) => {
        setquantity3Change(e.target.value);
        setQuoteData(prevQuoteData => ({
            ...prevQuoteData,
            quantities: [quantity1, quantity2, e.target.value, quantity4, quantity5]
        }));
    };
    const handleQuantity4Change = (e) => {
        setquantity4Change(e.target.value);
        setQuoteData(prevQuoteData => ({
            ...prevQuoteData,
            quantities: [quantity1, quantity2, quantity3, e.target.value, quantity5]
        }));
    };
    const handleQuantity5Change = (e) => {
        console.log(quoteData.leadTime);
        setquantity5Change(e.target.value);
        setQuoteData(prevQuoteData => ({
            ...prevQuoteData,
            quantities: [quantity1, quantity2, quantity3, quantity4, e.target.value]
        }));
    };

    const handleRevisionChange = (e) => {
        setRevision(e.target.value);
    };

    const handleFileChange = (e) => {
        setFile(e.target.files[0]);
    };

    const handleUpload = () => {
        if (!file) {
            console.log(formData.partNumber);
            console.log(quoteData.partNumber);
            console.log(formData.revision);
            console.log(quoteData.revision);
            alert("Please choose a file.");
            return; // Prevent further execution if file is not selected
        }
        if (!formData.partNumber) {
            console.log(formData.partNumber);
            console.log(quoteData.partNumber);
            console.log(formData.revision);
            console.log(quoteData.revision);
            alert("Please input a Part Number");
            return; // Prevent further execution if file is not selected
        }
        if (!formData.revision) {
            console.log(formData.partNumber);
            console.log(quoteData.partNumber);
            console.log(formData.revision);
            console.log(quoteData.revision);
            alert("Please input a Revision Number");
            return; // Prevent further execution if file is not selected
        }
        //navigate('/upload')
        // Handle the upload logic here
        //console.log('Uploading...');
        if(uploadClicked){
            //console.log(formData);
            if (!quoteData.leadTime || quoteData.leadTime.length === 0) {
                alert("Lead time data is missing.");
                return; // Prevent further execution if leadTime is empty
            }

            if (!quoteData.quantities || quoteData.quantities.length !== 5 || quoteData.quantities.some(qty => qty === undefined)) {
                alert("Quantities data is missing or incomplete.");
                return; // Prevent further execution if quantities data is missing or incomplete
            }
            handleSubmit();
            navigate('/upload', { state: { partNum: formData.partNumber} });
        }
        else{
            setUploadClicked(true);
        }
    };

    const handleNewPartClick = () => {
        setIsNewPart(true);
        setIsNewVersion(true);
    };

    const handleExistingPartClick = () => {
        setIsNewPart(false);
        setIsNewVersion(true);
    };

    const handleNewVersionClick = () => {
        setIsNewVersion(true);
    };

    const handleExistingVersionClick = () => {
        setIsNewVersion(false);
    };

    const handleSubmit = async (e) => {
        //e.preventDefault();
        const quoteDataa = new FormData();
        const formDataa = new FormData();
        formDataa.append("file", file);
        formDataa.append("contact", formData.contact);
        formDataa.append("phone", formData.phone);
        formDataa.append("customerEmail", formData.customerEmail);
        formDataa.append("partNumber", formData.partNumber);
        formDataa.append("revision", formData.revision);
        formDataa.append("soldermaskColor", formData.soldermaskColor);
        formDataa.append("thickness", formData.thickness);
        formDataa.append("finish", formData.finish);
        formDataa.append("legendColor", formData.legendColor);
        formDataa.append("material", formData.material);
        formDataa.append("extCopper", formData.extCopper);
        formDataa.append("intCopper", formData.intCopper);
        //setQuoteData(prevQuoteData => ({ ...prevQuoteData, quantities: [quantity1, quantity2, quantity3, quantity4, quantity5] }));
        //setQuoteData({ ...quoteData, quantities: [quantity1, quantity2, quantity3, quantity4, quantity5] });

        quoteDataa.append("partNumber", quoteData.partNumber);
        quoteDataa.append("revisionNum", quoteData.revision);
        quoteDataa.append("materialType", quoteData.material);
        quoteDataa.append("soldermask", quoteData.soldermask);
        quoteDataa.append("soldermaskColor", quoteData.soldermaskColor);
        quoteDataa.append("legend", quoteData.legend);
        quoteDataa.append("legendColor", quoteData.legendColor);
        quoteDataa.append("surfaceFinish", quoteData.finish);
        quoteDataa.append("leadTime", quoteData.leadTime);
        //quoteDataa.append("quantities", JSON.stringify([quantity1, quantity2, quantity3, quantity4, quantity5]));
        //console.log([quantity1, quantity2, quantity3, quantity4, quantity5]);
        //console.log(quoteData.quantities);
        console.log("QuoteData", quoteData);
        
        console.log("Form Data", formData);
        // Add file to the form data

        try {
            const response = await fetch('/userdata', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify(quoteData),
            });
      
            const data = await response.json();
      
            if (response.ok) {
              // Authentication successful, redirect to the desired route
              try {
                const response = await fetch('/api/upload', {
                  method: 'POST',
                  body: formDataa,
                });
              } catch (error) {
                console.error('Error:', error);
                alert('An error occurred while uploading the form data');
              }
            } else {
              // Authentication failed, display error message
              alert(data.message);
            }
          } catch (error) {
            console.error('Error:', error);
            alert('An error occurred while uploading the quote data');
          }
        
      };

      const handleBack = async () => {
        navigate("/myQuotes")
      };

    return (
        <div id="content-to-pdf" className="content-to-pdf">
            <div className="header">
                <h1>Amitron Quoting: New Quote</h1>
                <button onClick={handleBack}>Back</button>
            </div>
            <div className="new-quote-container">
                <div>
                <div className="button-bar">
                    <button className={isNewPart ? "new-part-button selected" : "new-part-button"} onClick={handleNewPartClick}>New Part</button>
                    <button className={!isNewPart ? "existing-part-button selected" : "existing-part-button"} onClick={handleExistingPartClick}>Existing Part</button>
                </div>
                <div className="input-container">
                    <div className="input-group">
                        <label htmlFor="partNumber">Part Number:</label>
                        <input type="text" id="partNumber" name="partNumber" value={formData.partNumber} onChange={handleChange}/>
                    </div>
                    {isNewPart && (
                        <div className="input-group">
                            <label htmlFor="revision">Revision:</label>
                            <input type="text" id="revision" name="revision" value={formData.revision} onChange={handleChange} />
                        </div>
                    )}
                </div>
                {!isNewPart && (
                    <div>
                        <div className="button-bar">
                            <button className={isNewVersion ? "new-part-button selected" : "new-part-button"} onClick={handleNewVersionClick}>New Revision</button>
                            <button className={!isNewVersion ? "existing-part-button selected" : "existing-part-button"} onClick={handleExistingVersionClick}>Existing Revision</button>
                        </div>
                        {isNewVersion && (
                            <div className="input-group" style={{display: 'inline-block'}}>
                                <label htmlFor="newRevision">New Revision:</label>
                                <input type="text" id="newRevision" name="revision" value={formData.revision} onChange={handleChange} style={{maxWidth: '180px'}}/>
                            </div>
                        )}
                    </div>
                )}
                {isNewVersion && (
                    <div>
                        <div className="file-upload-container">
                            <label htmlFor="file-upload" className="file-upload-button">Choose File: </label>
                            <input type="file" id="file-upload" className="file-input" onChange={handleFileChange} />
                            {file && <p className="file-name">Selected File: {file.name}</p>}
                        </div>
                        <p className="upload-description">What to Upload? Zip file of Gerber Data.</p>
                        {uploadClicked &&(
                            <div>
                                <h2>Quote Options:</h2>
                                <div className="dropdown-container">
                                    <label htmlFor="materialType">Material Type:</label>
                                    <select 
                                        id="materialType"
                                        name="material"
                                        value={formData.material}
                                        onChange={handleChange}>
                                        {/* Options for Material Type */}
                                        <option value="FR4">FR4</option>
                                        <option value="High Temp FR4">High Temp FR4</option>
                                        <option value="Aluminum Substrate">Aluminum Substrate</option>
                                        <option value="RF">RF</option>
                                    </select>
                                </div>
                                <div className="dropdown-container">
                                    <label htmlFor="soldermask1">Soldermask:</label>
                                    <select 
                                        id="soldermask1"
                                        name="soldermask"
                                        value={quoteData.soldermask}
                                        onChange={handleChanges}>
                                        {/* Options for Soldermask 1 */}
                                        <option value="None">None</option>
                                        <option value="1 Sided">1 Sided</option>
                                        <option value="2 Sided">2 Sided</option>
                                    </select>
                                    <select 
                                        id="soldermask2"
                                        name="soldermaskColor"
                                        value={formData.soldermaskColor}
                                        onChange={handleSoldermaskColorChange}>
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
                                    <select 
                                        id="legendType1"
                                        name="legend"
                                        value={quoteData.legend}
                                        onChange={handleChanges}>
                                        {/* Options for Legend Type 1 */}
                                        <option value="None">None</option>
                                        <option value="1 Sided">1 Sided</option>
                                        <option value="2 Sided">2 Sided</option>
                                    </select>
                                    <select 
                                        id="legendType2"
                                        name="legendColor"
                                        value={formData.legendColor}
                                        onChange={handleChange}>
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
                                    <select 
                                        id="surfaceFinish"
                                        name="finish"
                                        value={formData.finish}
                                        onChange={handleChange}>
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
                        )}
                    </div>
                )}   
                
                </div>
                <div className="buttons-container">
                    {/* Download PDF button */}

                    {/* Upload button */}
                    <button className="button-containers" onClick={handleUpload}>
                        {uploadClicked ? "Generate Quote" : isNewVersion ? "Next" : "Generate Quote"}
                    </button>                    
                </div> 
            </div>
        </div>
    );
}

export default NewQuote;

import React, { useState } from 'react';
import './App.css';
import FileChecker from './FileChecker';

function Home() {
  const [file, setFile] = useState(null);
  const [formData, setFormData] = useState({
    contact: 'Purchase Agent',
    phone: '',
    customerEmail: '',
    partNumber: '',
    revision: '',
    soldermaskColor: 'Black',
    thickness: '',
    finish: 'ENIG',
    legendColor: 'Black',
    material: 'Core',
    extCopper: '1.5 oz',
    intCopper: '1.5 oz',
  });

  const [quoteNumber, setQuoteNumber] = useState(null);
  const [showFileChecker, setShowFileChecker] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const generateRandomQuoteNumber = () => {
    // Generate a random 6-digit number
    const randomQuoteNumber = Math.floor(100000 + Math.random() * 900000);
    setQuoteNumber(randomQuoteNumber);
  };

  const handleSubmit = async (e) => {
    generateRandomQuoteNumber();
    setShowFileChecker(true);
    e.preventDefault();

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
    // Add file to the form data

    try {
      const response = await fetch("http://localhost:5000/upload", {
        method: "POST",
        body: formDataa,
      });

      if (response.ok) {
        console.log("File uploaded and data received on the server.");
      } else {
        console.error("Error uploading file and data:", response.statusText);
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <div className="App">
      <h1>Quote Generator</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Contact:</label>
          <select name="contact" value={formData.contact} onChange={handleChange} required>
            <option value="Purchase Agent">Purchase Agent</option>
            <option value="QC Engineer 1">QC Engineer 1</option>
            <option value="Accounting">Accounting</option>
            <option value="Engineer 3">Engineer 3</option>
            <option value="QC Engineer 2">QC Engineer 2</option>
            <option value="Engineer 1">Engineer 1</option>
            <option value="Engineer 2">Engineer 2</option>
          </select>
        </div>
        <div>
          <label>Phone:</label>
          <input
            type="text"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Customer Email:</label>
          <input
            type="text"
            name="customerEmail"
            value={formData.customerEmail}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Part Number:</label>
          <input
            type="text"
            name="partNumber"
            value={formData.partNumber}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Revision:</label>
          <input
            type="text"
            name="revision"
            value={formData.revision}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Attach File: </label>
          <label htmlFor="file-upload" className="custom-upload-button" required>
            Choose File
          </label>
          <input
            type="file"
            id="file-upload"
            onChange={handleFileChange}
            style={{ display: 'none' }} // Hide the actual file input
            required
          />
        </div>
        <fieldset>
          <legend>Specifications</legend>
          <div>
            <label>Soldermask Color:</label>
            <select
              name="soldermaskColor"
              value={formData.soldermaskColor}
              onChange={handleChange}
              required
            >
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
          <div>
            <label>Thickness:</label>
            <input
              type="text"
              name="thickness"
              value={formData.thickness}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <label>Finish:</label>
            <select
              name="finish"
              value={formData.finish}
              onChange={handleChange}
              required
            >
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
          <div>
            <label>Legend Color:</label>
            <select
              name="legendColor"
              value={formData.legendColor}
              onChange={handleChange}
              required
            >
              <option value="Black">Black</option>
              <option value="Blue">Blue</option>
              <option value="Green">Green</option>
              <option value="Red">Red</option>
              <option value="White">White</option>
              <option value="Yellow">Yellow</option>
            </select>
          </div>
          <div>
            <label>Material:</label>
            <select
              name="material"
              value={formData.material}
              onChange={handleChange}
              required
            >
              <option value="Core">Core</option>
              <option value="Electroless Chemical">Electroless Chemical</option>
              <option value="ET supplies">ET supplies</option>
              <option value="Foil">Foil</option>
              <option value="IMS">IMS</option>
              <option value="Laminate">Laminate</option>
              <option value="Meena Board">Meena Board</option>
              <option value="Metal Sheet">Metal Sheet</option>
              <option value="Prepreg">Prepreg</option>
              <option value="Router">Router</option>
            </select>
          </div>
          <div>
            <label>External Copper:</label>
            <select
              name="extCopper"
              value={formData.extCopper}
              onChange={handleChange}
              required
            >
              <option value="1.5 oz">1.5 oz</option>
              <option value="10 oz">10 oz</option>
              <option value="16 mL">16 mL</option>
              <option value="1 oz">1 oz</option>
              <option value="20 mL">20 mL</option>
              <option value="2 oz">2 oz</option>
              <option value="3 oz">3 oz</option>
              <option value="4 oz">4 oz</option>
              <option value="5 oz">5 oz</option>
              <option value="6 oz">6 oz</option>
              <option value="7 oz">7 oz</option>
              <option value="8 oz">8 oz</option>
              <option value="9 oz">9 oz</option>
              <option value="Hoz">Hoz</option>
              <option value="Qoz">Qoz</option>
            </select>
          </div>
          <div>
            <label>Internal Copper:</label>
            <select
              name="intCopper"
              value={formData.intCopper}
              onChange={handleChange}
              required
            >
              <option value="1.5 oz">1.5 oz</option>
              <option value="10 oz">10 oz</option>
              <option value="16 mL">16 mL</option>
              <option value="1 oz">1 oz</option>
              <option value="20 mL">20 mL</option>
              <option value="2 oz">2 oz</option>
              <option value="3 oz">3 oz</option>
              <option value="4 oz">4 oz</option>
              <option value="5 oz">5 oz</option>
              <option value="6 oz">6 oz</option>
              <option value="7 oz">7 oz</option>
              <option value="8 oz">8 oz</option>
              <option value="9 oz">9 oz</option>
              <option value="Hoz">Hoz</option>
              <option value="Qoz">Qoz</option>
            </select>
          </div>
        </fieldset>
        <div>
          <button type="submit" className="button-style">
            Upload
          </button>
        </div>
        {showFileChecker && <FileChecker />}
      </form>
    </div>
  );
}

export default Home;

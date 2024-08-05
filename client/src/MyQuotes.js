import React, { useState, useEffect } from 'react';
import './MyQuotes.css';
import { useNavigate } from 'react-router-dom';
import topImages from "./top.png";
import bottomImages from "./bottom.png";
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import axios from 'axios';
import AWS from 'aws-sdk';
import { expand } from 'braces';

const s3 = new AWS.S3({
  accessKeyId: 'AKIAYKCZBZUZZDY7KNAK',
  secretAccessKey: 'y5RtduXtCc4v39oLQdOZ2g1zquovInmhA1rLRX9m',
  region: 'us-east-2'
});

function MyQuotes() {
  // Dummy data for past quotes
  const navigate = useNavigate();

  const [clickedCells, setClickedCells] = useState([]);

  const [specData, setSpecData] = useState(null);

  const [topImageUrl, setTopImageUrl] = useState('');
  const [bottomImageUrl, setBottomImageUrl] = useState('');
  const [pastQuotes, setPastQuotes] = useState([
    { _id: 1, QuoteNumber: 'Q12345', Date: '1/2/2024', PartNumber: '123-ABCDEF', Status: 'Pending', Email: 'eaxample@email.com', folderName: '10000' },
    { _id: 2, QuoteNumber: 'Q12346', Date: '1/3/2024', PartNumber: '124-ABCDEF', Status: 'Approved', Email: 'example@email.com', folderName: '10000' },
    { _id: 3, QuoteNumber: 'Q12347', Date: '1/4/2024', PartNumber: '125:ABCDEF', Status: 'Rejected', Email: 'example@email.com', folderName: '10000' }
  ]);
  const [topImageKey, setTopImageKey] = useState('job.png');
  const [bottomImageKey, setBottomImageKey] = useState('i8_bottomview.png');
  const [expandedId, setExpandedId] = useState(null);
  const[loggedInUserEmail, setLoggedInUserEmail] = useState('');
  const [pendingQuotePartNumber, setPendingQuotePartNumber] = useState(null);
  const [formattedDate, setFormattedDate] = useState('');

  useEffect(() => {
    const fetchPendingQuotePartNumber = async () => {
      try {
        const response = await axios.get('/api/pendingQuotePartNumber');
        console.log(response.data);
        const currentDate = new Date();
        const formattedDate = `${currentDate.getMonth() + 1}/${currentDate.getDate()}/${currentDate.getFullYear()}`;
        setFormattedDate(formattedDate);
        setPendingQuotePartNumber(response.data.partNumber);
      } catch (error) {
        console.error('Error fetching pending quote part number:', error);
      }
    };

    fetchPendingQuotePartNumber();
  }, []);

  useEffect(() => {
    const params = {
      Bucket: 'amitron-quoting',
      Key: topImageKey
    };

    s3.getObject(params, (err, data) => {
      if (err) {
        console.error(err);
      } else {
        const url = URL.createObjectURL(new Blob([data.Body]));
        setTopImageUrl(url);
      }
    });
  }, [topImageKey]);

  useEffect(() => {
    const params = {
      Bucket: 'amitron-quoting',
      Key: bottomImageKey
    };

    s3.getObject(params, (err, data) => {
      if (err) {
        console.error(err);
      } else {
        const url = URL.createObjectURL(new Blob([data.Body]));
        setBottomImageUrl(url);
      }
    });
  }, [bottomImageKey]);

  useEffect(() => {
    const fetchSpecData = async () => {
      try {
        const response = await axios.get('/specs');
        console.log(response.data);
        setSpecData(response.data);
      } catch (error) {
        console.error('Error fetching specs:', error);
      }
    };

    fetchSpecData();
  }, []);

  useEffect(() => {
    const fetchPastQuotes = async () => {
      try {
        const response = await axios.get('/quoteoptions');
        console.log(response.data);
        setPastQuotes(response.data);
      } catch (error) {
        console.error('Error fetching past quotes:', error);
      }
    };

    fetchPastQuotes();
  }, []);

  useEffect(() => {
    if (expandedId !== null) {
      const quote = pastQuotes.find(q => q._id === expandedId);
      if (quote) {
        const expandedTopImageKey = quote.Email + '/' + quote.folderName + '/' + 'top.png';
        const expandedBottomImageKey = quote.Email + '/' + quote.folderName + '/' + 'bottom.png';
  
        setTopImageKey(expandedTopImageKey);
        setBottomImageKey(expandedBottomImageKey);
      }
    }
  }, [expandedId, pastQuotes]);

  useEffect(() => {
    const fetchUserEmail = async () => {
      try {
        const response = await axios.get('/loggedinuseremail');
        console.log(response.data);
        setLoggedInUserEmail(response.data.email);
      } catch (error) {
        console.error('Error fetching specs:', error);
      }
    };

    fetchUserEmail();
  }, []);

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

  // Function to handle cell click
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

  const [searchQuery, setSearchQuery] = useState('');
  const [uploadClicked, setUploadClicked] = useState(false);
  const [count, setCount] = useState(0);

  const handleSearchInputChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const filterQuotes = (quote) => {
    // Filter based on part number, quote number, email, or phone
    return (
      (quote.Email === loggedInUserEmail) && 
      (quote.PartNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      quote.folderName.toLowerCase().includes(searchQuery.toLowerCase()))
      // Add conditions for email and phone if available in your data
      // quote.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      // quote.phone.toLowerCase().includes(searchQuery.toLowerCase()) ||
      // ...
      // Return true for other fields you want to include in the search
    );
  };

  const handleUpload = (event, quote) => {
    event.stopPropagation();
    navigate('/placeOrder', {state: { quote } });
    //navigate('/upload')
    // Handle the upload logic here
    console.log(uploadClicked);
    setUploadClicked(true);
    setCount(count + 1);
    console.log(uploadClicked);

};

const handleLogout = async () => {
  try {
    // Make a POST request to the logout endpoint
    await axios.post('/logout');
    // Redirect the user to the login screen after successful logout
    navigate('/'); // Adjust the route as per your application
  } catch (error) {
    console.error('Error logging out:', error);
    // Handle errors if needed
  }
};

  // Render each past quote as a card

  const handleCardClick = async (_id) => {
    if (expandedId === _id) {
      setExpandedId(null); // Collapse if already expanded
    } else {
      setExpandedId(_id); // Expand if not expanded
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Here, you can perform authentication logic
    // For demo purposes, let's assume authentication is successful
    // Redirect the user to the desired route
    navigate('/newQuote'); // Specify your route here
  };

  const handlePlaceOrder = (e) => {
    e.preventDefault();
    navigate('/placeOrder');
  }

  const handleDropdownClick = (e) => {
    // Prevent the click event from bubbling up to the parent container
    e.stopPropagation();
  };
  
  const handleInputChange = (e) => {
    // Prevent the click event from bubbling up to the parent container
    e.stopPropagation();
  };

  function camelCaseToPhrase(camelCaseString) {
    // Split camel case string and insert space before uppercase letters
    if (camelCaseString === 'MaxAspectRatioonPTH') {
      return 'Max Aspect Ratio on PTH';
    }
  
    // Split camel case string and insert space before uppercase letters
    return camelCaseString
      .replace(/([a-z])([A-Z])/g, '$1 $2')
      // Capitalize the first letter of each word
      .replace(/\b\w/g, (char) => char.toUpperCase());
  }

  const renderExpandedView = (quote) => {
    const replaceSuperscript = (value) => {
      return value.replace(/inch\^2/g, 'inch²');
    };
    
    if (quote._id === expandedId) {
      return (
        <div className="expanded-info">
          {/* Add images */}
          <div className="images">
            <img src={topImageUrl} alt="Top View" className="image1"/>
            <img src={bottomImageUrl} alt="Bottom View" className="image2"/>
          </div>
          <div className='test-container'>
            <h3 className="top">Top View</h3>
            <h3 className="bottom">Bottom View</h3>
          </div>
          {/* Add table with two columns */}
          <h2 className="table-title">Summary - General - Original</h2>
          <div className="table-container">
            {specData ? (
              <div className="split-tables">
                <table className='table1'>
                  <tbody>
                    {/* Render the first 11 rows */}
                    {Object.entries(quote).slice(7, 13).map(([key, value]) => (
                      <tr key={key}>
                        <th>{camelCaseToPhrase(key)}</th>
                        <td>{replaceSuperscript(value)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                <table className='table2'>
                  <tbody>
                    {/* Render the second 11 rows */}
                    {Object.entries(quote).slice(13).map(([key, value]) => (
                      <tr key={key}>
                        <th>{camelCaseToPhrase(key)}</th>
                        <td>{replaceSuperscript(value)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <p>Loading...</p>
            )}
          </div>
          {!uploadClicked && (
            <div>
              <button className="upload-button" onClick={(event) => handleUpload(event, quote)}>Explore Options</button>
            </div>
          )}     
        </div>
      );
    }
    return null;
  };

  const renderQuoteCards = () => {
    if (!pastQuotes.every(dict => dict.Email !== loggedInUserEmail)) {
      // Sort pastQuotes array based on QuoteNumber in descending order

      const filteredQuotes = pastQuotes.filter(filterQuotes);

      if (filteredQuotes.length === 0) {
        return (
          <div className="no-quotes-message">
            <p>No quotes found.</p>
          </div>
        );
      }

      const sortedQuotes = pastQuotes
        .filter(filterQuotes)
        .sort((a, b) => {
          // Convert folderName to numbers for comparison
          const aFolder = parseInt(a.folderName);
          const bFolder = parseInt(b.folderName);
          return bFolder - aFolder; // Sort in descending order
      });
  
      return sortedQuotes.map(quote => (
        <div 
          key={quote._id} 
          className={`quote-card ${expandedId === quote._id ? 'expanded' : ''}`}
          onClick={() => handleCardClick(quote._id)}
        >
          <div className="top-info">
            <h2 className="quote-number">Quote Number: {quote.folderName}</h2>
            <h2 className="date">Date: {quote.Date}</h2>
            <h2 className="part-number">Part Number: {quote.PartNumber}</h2>
            <h2 className="status">Status: {quote.Status}</h2>
          </div>
          {renderExpandedView(quote)}
        </div>
      ));
    } else {
      return (
        <div className="no-quotes-message">
          <p>No past quotes available.</p>
        </div>
      );
    }
  };

  return (
    <div className="my-quotes-container">
      <div className="header" style={{marginBottom: '20px'}}>
        <h1 className="title">Amitron Quoting: My Quotes</h1>
        <div className="button-header">
          <button className="new-quote-button" onClick={handleSubmit}>New Quote</button>
          <button className="logout-button" onClick={handleLogout}>Logout</button>
        </div>
        {/* Search bar */}
        
      </div>
      <div className="quote-list">
        <input
          type="text"
          placeholder="Search by part number or quote number"
          value={searchQuery}
          onChange={handleSearchInputChange}
        />
        {pendingQuotePartNumber && (
          <div className="quote-card pending" style={{ backgroundColor: '#ffffcc' }}>
            <div className="top-info">
              <h2 className="quote-number">Quote: Processing</h2>
              <h2 className="date">Date: {formattedDate}</h2>
              <h2 className="part-number">Part Number: {pendingQuotePartNumber}</h2>
              <h2 className="status">Status: Pending</h2>
            </div>
            {/* Additional details if needed */}
          </div>
        )}
        {renderQuoteCards()}
      </div>
    </div>
  );
}

export default MyQuotes;
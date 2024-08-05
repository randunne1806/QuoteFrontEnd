import "./CartSummary.css";
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import PaymentForm from './PaymentForm';
import { Elements } from '@stripe/react-stripe-js';
import axios from 'axios';
import { loadStripe } from '@stripe/stripe-js';
import { useLocation } from 'react-router-dom';
import AWS from 'aws-sdk';

const stripePromise = loadStripe('your_publishable_api_key');

function CartSummary(){
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const location = useLocation();
    const selectedCell = location.state.selectedCell;
    const navigate = useNavigate();
    const [showPaymentForm, setShowPaymentForm] = useState(false);
    const [topImageKey, setTopImageKey] = useState('/api/png');
    const [bottomImageKey, setBottomImageKey] = useState('/api/pdf');
    const [topImageUrl, setTopImageUrl] = useState('');
    const [bottomImageUrl, setBottomImageUrl] = useState('');
    const [images, setImages] = useState([
        "/api/png",
        "/api/pdf"
    ]);
    const [quoteOptions, setQuoteOptions] = useState({
        partNumber: 0,
        revision: 0,
        material: 'FR4',
        soldermask: 'None',
        soldermaskColor: 'Black',
        legend: 'None',
        legendColor: 'Black',
        finish: 'ENIG',
        leadTime: ['1 Week', '2 Weeks', '3 Weeks'],
        quantities: ['1', '2', '3', '4', '5']
    });

    useEffect(() => {
        const fetchQuoteData = async () => {
          try {
            if(location.state && location.state.quoteData){
                console.log(selectedCell);
                setQuoteOptions(location.state.quoteData);
                const expandedTopImageKey = location.state.latestQuote.Email + '/' + location.state.latestQuote.folderName + '/' + 'top.png';
                const expandedBottomImageKey = location.state.latestQuote.Email + '/' + location.state.latestQuote.folderName + '/' + 'bottom.png';
        
                setTopImageKey(expandedTopImageKey);
                setBottomImageKey(expandedBottomImageKey);
            }
            else{
                const response = await axios.get('/specs');
                console.log(response.data);
                setQuoteOptions(response.data);
                console.log(quoteOptions);
            }
          } catch (error) {
            console.error('Error fetching specs:', error);
          }
        };
    
        fetchQuoteData();
      }, []);

      useEffect(() => {
        const s3 = new AWS.S3({
            accessKeyId: 'AKIAYKCZBZUZZDY7KNAK',
            secretAccessKey: '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',
            region: 'us-east-2'
          });
        const params = {
          Bucket: 'amitron-quoting',
          Key: topImageKey
        };
    
        s3.getObject(params, (err, data) => {
          if (err) {
            console.error(err);
          } else {
            const url = URL.createObjectURL(new Blob([data.Body]));
            setImages(prevImages => {
                const updatedImages = [...prevImages];
                updatedImages[0] = url;
                return updatedImages;
            });
          }
        });
      }, [topImageKey]);
    
      useEffect(() => {
        const s3 = new AWS.S3({
            accessKeyId: 'AKIAYKCZBZUZZDY7KNAK',
            secretAccessKey: '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',
            region: 'us-east-2'
          });
        const params = {
          Bucket: 'amitron-quoting',
          Key: bottomImageKey
        };
    
        s3.getObject(params, (err, data) => {
          if (err) {
            console.error(err);
          } else {
            const url = URL.createObjectURL(new Blob([data.Body]));
            setImages(prevImages => {
                const updatedImages = [...prevImages];
                updatedImages[1] = url;
                return updatedImages;
            });
          }
        });
      }, [bottomImageKey]);

      useEffect(() => {
        console.log("quoteOptions:", quoteOptions);
    }, [quoteOptions]);

    const handleImageClick = (index) => {
        console.log("quoteOptions:", quoteOptions);
        setCurrentImageIndex(index);
    };
    
    const handleSubmit = (e) => {
        e.preventDefault();
        navigate('/pricingTable', { state: { quote: location.state.latestQuote, quoteOptions: location.state.quoteData }}); // Redirect the user to the desired route
    };

    const handlePaymentButtonClick = () => {
        setShowPaymentForm(true); // Show the payment form when the button is clicked
    };

    const [selectedCells, setSelectedCells] = useState([]);

    // Function to handle cell click
    const handleCellClick = (quantity, index) => {
        const cellIndex = selectedCells.indexOf(quantity);
        if (cellIndex === -1) {
            // If the quantity is not already selected, add it to the selected cells
            setSelectedCells([...selectedCells, quantity]);
        } else {
            // If the quantity is already selected, remove it from the selected cells
            const updatedSelectedCells = [...selectedCells];
            updatedSelectedCells.splice(cellIndex, 1);
            setSelectedCells(updatedSelectedCells);
        }
    };
    
    return(
            <div style={{maxWidth: '800px', margin: '0 auto'}}>
                <h1>Amitron Quoting: Cart Summary</h1>
                <div className="carts-container" style={{marginBottom: '20px'}}>
                    <div className="test-container">
                        <div>
                            <div className="image-gallery-container">
                                <div className="main-image-container">
                                    <img
                                        src={images[currentImageIndex]}
                                        alt={`Image ${currentImageIndex + 1}`}
                                        className="main-image"
                                    />
                                </div>
                                <div className="preview-images-container">
                                    {images.map((image, index) => (
                                        <img
                                            key={index}
                                            src={image}
                                            alt={`Image ${index + 1}`}
                                            className={`preview-image ${index === currentImageIndex ? 'active' : ''}`}
                                            onClick={() => handleImageClick(index)}
                                        />
                                    ))}
                                </div>
                            </div>
                        </div>
                        <div className="supertable">
                            <div className="test-container">
                                <div className="quote-option" onClick={(e) => e.stopPropagation()}>
                                    <h2>Quote Options</h2>
                                    <table className="quote-options-table">
                                        <tbody>
                                            <tr>
                                                <td>Material Type:</td>
                                                <td>{quoteOptions && quoteOptions.material}</td>
                                            </tr>
                                            <tr>
                                                <td>Soldermask:</td>
                                                <td>{quoteOptions && quoteOptions.soldermask}</td>
                                                <td>{quoteOptions && quoteOptions.soldermaskColor}</td>
                                            </tr>
                                            <tr>
                                                <td>Legend Type:</td>
                                                <td>{quoteOptions && quoteOptions.legend}</td>
                                                <td>{quoteOptions && quoteOptions.legendColor}</td>
                                            </tr>
                                            <tr>
                                                <td>Surface Finish:</td>
                                                <td>{quoteOptions && quoteOptions.finish}</td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                                
                            </div>
                            <div>
                                <div className="table-container">
                                    <table className="custom-tables">
                                        <tbody>
                                            <tr>
                                                <td className="amount" style={{paddingLeft: '8px'}}>
                                                    {selectedCell.quantity} Boards with a lead time of {selectedCell.leadTime}
                                                </td>
                                                <td className="right-aligned">
                                                    <b>{selectedCell.value === null ? '$$$' :
                                                        (selectedCell.value === '$$$' ? selectedCell.value :
                                                            (selectedCell.value && !isNaN(selectedCell.value)) ? `$${selectedCell.value.toFixed(2)}` :
                                                            selectedCell.value)}
                                                    </b>
                                                </td>
                                            </tr>
                                            <tr>
                                                <td>
                                                    <div className="amount">
                                                        <button onClick={handleSubmit}>Edit</button>
                                                    </div>
                                                </td>
                                                <td>
                                                    <div className="right-aligned">
                                                        <button onClick={handlePaymentButtonClick}>Payment</button>
                                                    </div>
                                                </td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    </div>
                        {showPaymentForm && (
                            <div>
                                <h2>Payment:</h2>
                                <div className="payment-form-container">
                                    <Elements stripe={stripePromise}>
                                        <PaymentForm className="payment-form" />
                                    </Elements>
                                </div>
                            </div>
                        )}
                    
                </div>
            </div>
        
    );
}

export default CartSummary;
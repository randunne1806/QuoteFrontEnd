import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import './PricingTable.css';

function PricingTable() {
    const navigate = useNavigate();
    const location = useLocation();
    const [selectedCell, setSelectedCell] = useState(null);
    const [priceArray, setPriceArray] = useState([]);
    const [latestQuote, setLatestQuote] = useState({
        _id : "test",
        Email : "sean.randunne@amitron.com",
        folderName : "10000",
        QuoteNumber : "Q10000",
        Date : "3/22/2024",
        PartNumber : "0X6816489000",
        Status : "Approved",
        PCBSize : "18.0 inch x 24.0 inch",
        PCBThickness : "50.0 mil",
        CopperLayers : "2",
        SurfaceFinish : "ENIG",
        SolderMaskColor : "LED White",
        LegendColor : "Black",
        EdgeConnectorArea : "0 inch^2",
        PeeloffMask : "No",
        CarbonMask : "No",
        MaxAspectRatioonPTH : "1.3",
        DrillHoleDensity : "8 Holes/inch^2",
        Castellated : "No"
    });
    const [quoteData, setQuoteData] = useState({
        partNumber: 0,
        revision: 0,
        material: 'FR4',
        soldermask: 'None',
        soldermaskColor: 'Black',
        legend: 'None',
        legendColor: 'Black',
        finish: 'ENIG',
        leadTime: ['1 Week', '2 Weeks', '3 Weeks'],
        quantities: ['100', '200', '300', '400', '500']
    });
    const [historicalQuotes, setHistoricalQuotes] = useState([]);

    function calculateAveragePrices(quotes) {
        const leadTimes = ['1', '2', '3', '4'];
        const priceBracket = [];
    
        // Extract price brackets from all quotes
        quotes.forEach(quote => {
            const quotePriceBracket = Object.values(quote.PriceBracket).flat();
            priceBracket.push(...quotePriceBracket);
        });
    
        const averagePrices = [];
    
        leadTimes.forEach(leadTime => {
            const prices = [];
            priceBracket.forEach(bracket => {
                if (bracket[leadTime]) {
                    prices.push(bracket[leadTime]);
                }
            });
            const total = prices.reduce((sum, price) => sum + price, 0);
            const average = total / prices.length;
            averagePrices.push(average);
        });
    
        return averagePrices;
    }

    useEffect(() => {
        const fetchData = async () => {
            try {
                if (location.state && location.state.quote) {
                    // If quote data is available in the location state, use it
                    console.log(location.state.quoteOptions);
                    setLatestQuote(location.state.quote);
                    setQuoteData(location.state.quoteOptions);
                    //console.log(location.state.quote);
                    const response = await axios.get(`/partNumber/${location.state.quote.PartNumber}`);
                    console.log(response.data);
                    setHistoricalQuotes(response.data);
                    setPriceArray(calculateAveragePrices(response.data));
                } else {
                    // Otherwise, fetch data from the '/quoteoptions' endpoint
                    const response = await axios.get('/quoteoptions');
                    console.log(response.data);
                    const newestQuoteOption = response.data.reduce((prev, current) =>
                        (prev._id > current._id) ? prev : current
                    );

                    // Set the newest quote option to the state
                    setLatestQuote(newestQuoteOption);

                    const response2 = await axios.get('/specs');
                    console.log(response2.data);
                    setQuoteData(response2.data);
                }
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchData();
    }, [location.state]);

      const handleCellClick = (leadTime, quantity, rowIndex, colIndex, cellValue) => {
        console.log({ leadTime, quantity, row: rowIndex, col: colIndex, value: cellValue });
        setSelectedCell({ leadTime: leadTime, quantity: quantity, row: rowIndex, col: colIndex, value: cellValue });
    };

    const handleUpload = () => {
        if(!selectedCell){
            alert("Please make a selection before proceeding to the Payment Screen");
            return;
        }
        navigate('/cartSummary', { state: { selectedCell, quoteData, latestQuote } });
    };

    const handleBack = async () => {
        navigate("/myQuotes")
      };

    return (
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
            <div className="header">
                <h1>Amitron Quoting: New Quote</h1>
                <button onClick={handleBack}>My Quotes</button>
            </div>
            <div className="new-containers">
                <h2>Quote Number: Q{latestQuote.folderName}</h2>
                
                <table>
                    <thead>
                        <tr>
                            <th></th>
                            {quoteData.quantities.map((quantity, index) => (
                                <th key={index}>{quantity}</th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {quoteData.leadTime.map((leadTime, leadTimeIndex) => (
                            <tr key={leadTimeIndex}>
                                <th>{leadTime}</th>
                                {quoteData.quantities.map((quantity, quantityIndex) => {
                                    const priceIndex = 3 - leadTimeIndex - 1; // Convert to correct index for priceArray
                                    const price = priceArray.length ? priceArray[priceIndex] * quantity : null;
                                    return (
                                        <td
                                            key={quantityIndex}
                                            className={`pricing-cell ${
                                                selectedCell?.row === leadTimeIndex &&
                                                selectedCell?.col === quantityIndex &&
                                                'selected'
                                            }`}
                                            onClick={() => handleCellClick(leadTime, quantity, leadTimeIndex, quantityIndex, price)}
                                        >
                                            {price !== null ? `$${price.toFixed(2)}` : '$$$'} {/* Display price with 2 decimal places if available, otherwise display $$$ */}
                                        </td>
                                    );
                                })}
                            </tr>
                        ))}
                    </tbody>
                </table>
                <button className="estimate-button" onClick={handleUpload}>
                    Get Estimate
                </button>
            </div>
        </div>
    );
}

export default PricingTable;

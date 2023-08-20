import React from 'react';
import { Button } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMoneyBillAlt, faHandHoldingUsd, faList, faExchangeAlt } from '@fortawesome/free-solid-svg-icons';
import { useAuth } from '../auth';

const HomePage = () => {
    const [logged] = useAuth();

    return (
        <div className="d-flex flex-column align-items-center mt-5">
            <div className="d-flex justify-content-center mt-4 nawa">
            {logged && (
                <div className="text-center mx-4">
                    <a style={{ textDecoration: 'none' }} href="/transactions">
                        <FontAwesomeIcon icon={faList} size="3x" className="text-black" />
                        <p style={{ color: 'black', fontWeight: 'bold' }}>Transactions</p>
                    </a>
                </div>
            )}
                {logged && (
                    <div className="text-center mx-4">
                        <a style={{ textDecoration: 'none' }} href="/transfer">
                            <FontAwesomeIcon icon={faMoneyBillAlt} size="3x" className="text-black" />
                            <p style={{ color: 'black', fontWeight: 'bold' }}>Transfer</p>
                        </a>
                    </div>
                )}
            </div>
            <div className="d-flex justify-content-center mt-4 nawa">
                {logged && (
                    <div className="text-center mx-4">
                        <a style={{ textDecoration: 'none' }} href="/apply-for-loan">
                            <FontAwesomeIcon icon={faHandHoldingUsd} size="3x" className="text-black" />
                            <p style={{ color: 'black', fontWeight: 'bold' }}>Apply for Loan</p>
                        </a>
                    </div>
                )}
                {logged && (
                    <div className="text-center mx-4">
                        <a style={{ textDecoration: 'none' }} href="/repay-loan">
                            <FontAwesomeIcon icon={faExchangeAlt} size="3x" className="text-black" />
                            <p style={{ color: 'black', fontWeight: 'bold' }}>Repay Loan</p>
                        </a>
                    </div>
                )}
            </div>
            {!logged && (
                <div className="mb-2 text-center">
                    <h1 className="text-center mb-5">Welcome to OjBank</h1>
                    <a style={{ textDecoration: 'none' }} href="/signup">
                        <Button variant="dark" size="lg">
                            Sign Up
                        </Button>{' '}
                    </a>
                    <a style={{ textDecoration: 'none' }} href="/login">
                        <Button variant="dark" size="lg">
                            Log In
                        </Button>
                    </a>
                </div>
            )}
            {/* Additional content */}
        </div>
    );
}

export default HomePage;
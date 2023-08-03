import React, { useState } from 'react';
import './App.css';

const SQLGenerator = () => {
  const [opi, setOpi] = useState('')

  const [loanId, setLoanId] = useState('')
  const [loanUUID, setLoanUUID] = useState('')

  const [pBillingId, setPBillingId] = useState('')
  const [pBillingUUID, setPBillingUUID] = useState('')

  const [billing_3, setBilling_3] = useState('')
  const [billingDate_3, setBillingDate_3] = useState('')

  const [billing_4, setBilling_4] = useState('')

  const [billing_5, setBilling_5] = useState('')

  const [orderID, setorderID] = useState('')

  const [paymentLink, setPaymentLink] = useState('')

  const [expiryDate, setExpiryDate] = useState('')
  const [createDate, setCreateDate] = useState('')

  const [balance, setBalance] = useState('')


  const [generatedSQL, setGeneratedSQL] = useState('');

  const generateSQL = () => {
    // const columnNames = columns.split(',').map(column => column.trim()).join(', ');
    // const sql = `CREATE TABLE ${tableName} (${columnNames});`;
    const sql = `

    -- https://moladin.atlassian.net/browse/OPI-${opi}

USE dealer_financing;
 
UPDATE dealer_financing.active_loan
SET loan_period_days = 80,
	end_date = DATE_ADD(end_date, INTERVAL 40 DAY),
    billing_cycle_days = '{"billingPeriod": [14, 28, 40, 54, 68]}',
    updated_at = NOW()
WHERE id = ${loanId} AND uuid = '${loanUUID}';

UPDATE dealer_financing.payment_billing
SET billing_cycle=6, billing_date= DATE_ADD(billing_date, INTERVAL 40 DAY), billing_status='pending',updated_at=NOW()
WHERE id=${pBillingId} AND uuid = '${pBillingUUID}';

INSERT INTO dealer_financing.payment_billing
(uuid, loan_id, collection_type, billing_cycle, projection_amount, billing_date, billing_status,created_at)
VALUES(UUID(),  ${loanId}, 'interest', 3,   ${billing_3}.0, '${billingDate_3} 16:59:59', 'paid',NOW());

INSERT INTO dealer_financing.payment_billing
(uuid, loan_id, collection_type, billing_cycle, projection_amount, billing_date, billing_status,created_at)
VALUES(UUID(),  ${loanId}, 'interest', 4,    ${billing_4}.0, DATE_ADD('${billingDate_3} 16:59:59',INTERVAL 14 DAY), 'pending',NOW());

INSERT INTO dealer_financing.payment_billing
(uuid, loan_id, collection_type, billing_cycle, projection_amount, billing_date, billing_status,created_at)
VALUES(UUID(),  ${loanId}, 'interest', 5,   ${billing_5}.0, DATE_ADD('${billingDate_3} 16:59:59',INTERVAL 28 DAY), 'pending',NOW());

INSERT INTO dealer_financing.active_loan_states
(uuid, state, active_loan_id, activity_date, description, metadata, created_at)
VALUES(UUID(), 'loan-extension-created',  ${loanId}, now() ,'extension with OPI-${opi}', '{}',NOW());

INSERT INTO dealer_financing.loan_payments
(loan_id, order_id, payment_date, payment_type, payment_notes, payment_amount, payment_method, payment_status, payment_link, payment_link_expiry, billing_cycle_number, created_at, updated_at)
VALUES
( ${loanId}, '${orderID}', NULL, 'interest-fee', 'partial-repayment-manual-extension',  ${billing_3}, 'cash', 'paid', '${paymentLink}', '${expiryDate}', 3, '${createDate}','${createDate}');

INSERT INTO dealer_financing.balance_history
(loan_id, user_id, transaction_type, activity_date, description, 'type', amount, outstanding_balance, reference_billing, created_at, updated_at)
VALUES
( ${loanId}, 'system', 'INTEREST_PAYMENT', '${createDate}', 'payment for billing cycle 3 (Manual Extension)', 'CREDIT', -${billing_3}, ${balance - billing_3}, ${pBillingId}, NOW(),NOW());
    
    `;
    setGeneratedSQL(sql);
  };

  const copyToClipboard = () => {
    if (generatedSQL) {
      navigator.clipboard.writeText(generatedSQL)
        .then(() => alert('SQL code copied to clipboard!'))
        .catch(() => alert('Failed to copy SQL code. Please try again.'));
    }
  };

  return (
    <div className="sql-generator">
      <h1>Loan Extension query generator V.0.1</h1>
      <div>
        <label>
          OPI Number:
          <input type="text" value={opi} onChange={(e) => setOpi(e.target.value)} />
        </label>
      </div>

      <div>
        <label>
          Active Loan ID:
          <input type="text" value={loanId} onChange={(e) => setLoanId(e.target.value)} />
        </label>
      </div>

      <div>
        <label>
          Active Loan UUID:
          <input type="text" value={loanUUID} onChange={(e) => setLoanUUID(e.target.value)} />
        </label>
      </div>

      <div>
        <label>
          OMS Order ID:
          <input type="text" value={orderID} onChange={(e) => setorderID(e.target.value)} />
        </label>
      </div>

      <div>
        <label>
          Payment Billing 3 ID:
          <input type="text" value={pBillingId} onChange={(e) => setPBillingId(e.target.value)} />
        </label>
      </div>

      <div>
        <label>
          Payment Billing 3 UUID:
          <input type="text" value={pBillingUUID} onChange={(e) => setPBillingUUID(e.target.value)} />
        </label>
      </div>

      <div>
        <label>
          Payment Link:
          <input type="text" value={paymentLink} onChange={(e) => setPaymentLink(e.target.value)} />
        </label>
      </div>

      <div>
        <label>
          Date Hari Ini :
          <input type="text" value={billingDate_3} onChange={(e) => setBillingDate_3(e.target.value)} />
        </label>
      </div>

      <div>
        <label>
          Paid At Date :
          <input type="text" value={createDate} onChange={(e) => setCreateDate(e.target.value)} />
        </label>
      </div>

      <div>
        <label>
          Link Expiry Date :
          <input type="text" value={expiryDate} onChange={(e) => setExpiryDate(e.target.value)} />
        </label>
      </div>

      <div>
        <label>
          Billing 3 Amount :
          <input type="text" value={billing_3} onChange={(e) => setBilling_3(e.target.value)} />
        </label>
      </div>

      <div>
        <label>
          Billing 4 Amount :
          <input type="text" value={billing_4} onChange={(e) => setBilling_4(e.target.value)} />
        </label>
      </div>

      <div>
        <label>
          Billing 5 Amount :
          <input type="text" value={billing_5} onChange={(e) => setBilling_5(e.target.value)} />
        </label>
      </div>

      <div>
        <label>
          Last Outstanding Balance :
          <input type="text" value={balance} onChange={(e) => setBalance(e.target.value)} />
        </label>
      </div>
      
      <div>
        <button onClick={generateSQL}>Generate SQL</button>
      </div>
      {generatedSQL && (
        <div className="sql-result">
          <h2>Generated SQL:</h2>
          <button onClick={copyToClipboard}>Copy SQL</button>
          <code>{generatedSQL}</code>
          
        </div>
      )}
    </div>
  );
};

function App() {
  return (
    <div className="App">
      <SQLGenerator />
    </div>
  );
}

export default App;



    -- https://moladin.atlassian.net/browse/OPI-7983

USE dealer_financing;
 
UPDATE dealer_financing.active_loan
SET loan_period_days = 80,
	end_date = DATE_ADD(end_date, INTERVAL 40 DAY),
    billing_cycle_days = '{"billingPeriod": [14, 28, 40, 54, 68]}',
    updated_at = NOW()
WHERE id = 769 AND uuid = '348b0c4a-276c-4faa-8e27-2b4c729e80a1';

UPDATE dealer_financing.payment_billing
SET billing_cycle=6, billing_date= DATE_ADD(billing_date, INTERVAL 40 DAY), billing_status='pending',updated_at=NOW()
WHERE id=2988 AND uuid = '04f2e31e-9e39-4c19-9cb5-2e8942390117';

INSERT INTO dealer_financing.payment_billing
(uuid, loan_id, collection_type, billing_cycle, projection_amount, billing_date, billing_status,created_at)
VALUES(UUID(),  769, 'interest', 3,   780000.0, '04-08-2023 16:59:59', 'paid',NOW());

INSERT INTO dealer_financing.payment_billing
(uuid, loan_id, collection_type, billing_cycle, projection_amount, billing_date, billing_status,created_at)
VALUES(UUID(),  769, 'interest', 4,    910000.0, DATE_ADD('04-08-2023 16:59:59',INTERVAL 14 DAY), 'pending',NOW());

INSERT INTO dealer_financing.payment_billing
(uuid, loan_id, collection_type, billing_cycle, projection_amount, billing_date, billing_status,created_at)
VALUES(UUID(),  769, 'interest', 5,   910000.0, DATE_ADD('04-08-2023 16:59:59',INTERVAL 28 DAY), 'pending',NOW());

INSERT INTO dealer_financing.active_loan_states
(uuid, state, active_loan_id, activity_date, description, metadata, created_at)
VALUES(UUID(), 'loan-extension-created',  769, now() ,'extension with OPI-7983', '{}',NOW());

INSERT INTO dealer_financing.loan_payments
(loan_id, order_id, payment_date, payment_type, payment_notes, payment_amount, payment_method, payment_status, payment_link, payment_link_expiry, billing_cycle_number, created_at, updated_at)
VALUES
( 769, 'a2e9d909-7ba8-44bd-8cc2-9af4f316a07e', NULL, 'interest-fee', 'partial-repayment-manual-extension',  780000, 'cash', 'paid', ' https://app.midtrans.com/snap/v3/redirection/a09bed08-3abe-43a4-a6e6-9053f1c9e6c1', '2023-08-03 08:27:00 ', 3, '2023-08-02 09:29:00','2023-08-02 09:29:00');

INSERT INTO dealer_financing.balance_history
(loan_id, user_id, transaction_type, activity_date, description, 'type', amount, outstanding_balance, reference_billing, created_at, updated_at)
VALUES
( 769, 'system', 'INTEREST_PAYMENT', '2023-08-02 09:29:00', 'payment for billing cycle 3 (Manual Extension)', 'CREDIT', -780000, 99320000, 2988, NOW(),NOW());
    
    